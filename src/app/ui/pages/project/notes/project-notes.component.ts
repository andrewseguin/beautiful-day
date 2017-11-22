import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Note} from '../../../../model/note';
import {NotesService} from '../../../../service/notes.service';
import {MatDialog, MatMenu} from '@angular/material';
import {DeleteNoteComponent} from '../../../shared/dialog/delete-note/delete-note.component';
import {Subject} from 'rxjs';
import {PromptDialogComponent} from '../../../shared/dialog/prompt-dialog/prompt-dialog.component';

export interface NoteChange {
  noteId: string;
  text: string;
}

@Component({
  selector: 'project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.scss']
})
export class ProjectNotesComponent implements OnInit {
  projectId: string;
  notes: Note[];
  hoveringNavNoteId: string;

  title: string;
  noteId: string;
  text: string;

  noteChanged = new Subject<NoteChange>();
  noteFocused: boolean;

  @ViewChild('editNoteMenu') editNoteMenu: MatMenu;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mdDialog: MatDialog,
              private notesService: NotesService) { }

  ngOnInit() {
    this.noteChanged.asObservable().debounceTime(1000).subscribe(noteChange => {
      this.saveNoteText(noteChange.noteId, noteChange.text);
    });

    this.route.parent.params.flatMap(params => {
      this.projectId = params['id'];
      return this.notesService.getProjectNotes(this.projectId);
    }).subscribe(notes => {
      this.notes = notes;
    });

    this.route.params.subscribe(params => {
      this.noteId = params['noteId'];

      if (!this.noteId) {
        this.gotoDefaultNote(!!this.noteId);
      }
      this.notesService.get(this.noteId).subscribe((note: Note) => {
        if (this.noteId !== params['noteId']) { return; /* Subscription no longer relevant  */ }

        this.title = note.title;
        if (!this.noteFocused) { this.text = note.text; }
      });
    });
  }

  ngOnDestroy() {
    if (this.noteId) { this.saveNoteText(this.noteId, this.text); }
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

  openEditTitleDialog(id: string) {
    const note = this.getNote(id);
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Edit Title';
    dialogRef.componentInstance.input = note.title;
    dialogRef.componentInstance.onSave().subscribe(title => {
      this.notesService.update(note.$key, {title: <string>title});
    });
  }

  openDeleteNoteDialog(id: string) {
    const note = this.getNote(id);
    const dialogRef = this.mdDialog.open(DeleteNoteComponent);
    dialogRef.componentInstance.noteId = note.$key;
    dialogRef.componentInstance.title = note.title;

    dialogRef.componentInstance.onDelete().subscribe(() => {
      this.gotoDefaultNote(true);
    });
  }

  getNote(id: string): Note {
    let note = null;
    this.notes.forEach(n => { if (n.$key == id) { note = n; }});
    return note;
  }

  gotoDefaultNote(replaceNote: boolean) {
    this.notesService.getDefaultProjectNoteId(this.projectId).subscribe(noteId => {
      const path = (replaceNote ? '../' : '') + noteId;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }
}
