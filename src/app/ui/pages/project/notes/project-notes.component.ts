import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Note} from "../../../../model/note";
import {NotesService} from "../../../../service/notes.service";
import {MdDialog} from "@angular/material";
import {DeleteNoteComponent} from "../../../shared/dialog/delete-note/delete-note.component";
import {Subject} from "rxjs";
import {PromptDialogComponent} from "../../../shared/dialog/prompt-dialog/prompt-dialog.component";

export interface NoteChange {
  noteId: string;
  text: string;
}

@Component({
  selector: 'project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.scss'],
  host: {
    '[style.opacity]': '!!notes ? 1 : 0'
  }
})
export class ProjectNotesComponent implements OnInit {
  projectId: string;
  notes : Note[];

  title: string;
  noteId: string;
  text: string;

  noteChanged = new Subject<NoteChange>();
  noteFocused: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mdDialog: MdDialog,
              private notesService: NotesService) { }

  ngOnInit() {
    this.noteChanged.asObservable().debounceTime(1000).subscribe(noteChange => {
      this.saveNoteText(noteChange.noteId, noteChange.text);
    });

    this.route.parent.params.subscribe(params => {
      this.projectId = params['id'];
      this.notesService.getProjectNotes(this.projectId)
          .subscribe(notes => this.notes = notes);
    });

    this.route.params.subscribe(params => {
      this.noteId = params['noteId'];
      this.notesService.getNote(this.noteId).subscribe((note: Note) => {
        if (this.noteId != params['noteId']) { return; /* Subscription no longer relevant  */ }
        if (!note.$exists()) {
          this.gotoDefaultNote(!!this.noteId);
          return;
        }

        this.title = note.title;
        if (!this.noteFocused) { this.text = note.text; }
      });
    });
  }

  ngOnDestroy() {
    if (this.noteId) { this.saveNoteText(this.noteId, this.text) }
  }

  createNote() {
    this.notesService.addNote(this.projectId).then(response => {
      this.router.navigate([`../${response.key}`], {
        relativeTo: this.route
      });
    });
  }

  saveNoteText(noteId: string, text: string) {
    this.notesService.update(noteId, {text});
  }

  openEditTitleDialog() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Edit Title';
    dialogRef.componentInstance.input = this.title;
    dialogRef.componentInstance.onSave().subscribe(title => {
      this.notesService.update(this.noteId, {title});
    });
  }

  openDeleteNoteDialog() {
    const dialogRef = this.mdDialog.open(DeleteNoteComponent);
    dialogRef.componentInstance.noteId = this.noteId;
    dialogRef.componentInstance.title = this.title;

    dialogRef.componentInstance.onDelete().subscribe(() => {
      this.gotoDefaultNote(true);
    });
  }

  gotoDefaultNote(replaceNote: boolean) {
    this.notesService.getDefaultProjectNoteId(this.projectId).subscribe(noteId => {
      const path = (replaceNote ? '../' : '') + noteId;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }
}
