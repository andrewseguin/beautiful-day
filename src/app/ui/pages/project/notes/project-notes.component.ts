import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import * as CodeMirror from 'codemirror';
import {Note} from '../../../../model/note';
import {NotesService} from '../../../../service/notes.service';
import {EditNoteTitleComponent} from '../../../shared/dialog/edit-note-title/edit-note-title.component';
import {MdDialog} from '@angular/material';
import {DeleteNoteComponent} from '../../../shared/dialog/delete-note/delete-note.component';
import {FirebaseListObservable} from 'angularfire2';
import EditorFromTextArea = CodeMirror.EditorFromTextArea;

const CodeMirrorConfig = {
  lineWrapping: true,
  electricChars: false
};

@Component({
  selector: 'project-notes',
  templateUrl: './project-notes.component.html',
  styleUrls: ['./project-notes.component.scss'],
  host: {
    '[style.opacity]': '!!notes ? 1 : 0'
  }
})
export class ProjectNotesComponent implements OnInit {
  editor: EditorFromTextArea;
  projectId: string;
  title: string;
  noteId: string;
  notes : FirebaseListObservable<Note>;

  @ViewChild('editor') textarea: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mdDialog: MdDialog,
              private notesService: NotesService) { }

  ngOnInit() {
    this.initializeEditor();

    this.route.parent.params.subscribe(params => {
      this.projectId = params['id'];
      this.notes = this.notesService.getProjectNotes(this.projectId);
    });

    this.route.params.subscribe(params => {
      this.noteId = params['noteId'];
      this.notesService.getNote(this.noteId).take(1).subscribe((note: Note) => {
        if (!note.$exists()) {
          this.gotoDefaultNote(!!this.noteId);
          return;
        }

        if (!this.editor.hasFocus()) { this.setNote(note) }
      });
    });
  }

  initializeEditor() {
    this.editor = CodeMirror.fromTextArea(this.textarea.nativeElement, CodeMirrorConfig);
    this.editor.on('change', this.saveNote.bind(this));
  }

  setNote(note: Note) {
    this.title = note.title;

    // Update the editor with the new value
    if (this.editor.getValue() != note.text) {
      this.editor.setValue(note.text);
    }
  }

  createNote() {
    this.notesService.addNote(this.projectId).then(response => {
      this.router.navigate([`../${response.key}`], {
        relativeTo: this.route
      });
    });
  }

  saveNote() {
    this.notesService.update(this.noteId, {
      text: this.editor.getValue()
    });
  }

  openEditTitleDialog() {
    const dialogRef = this.mdDialog.open(EditNoteTitleComponent);
    dialogRef.componentInstance.noteId = this.noteId;
    dialogRef.componentInstance.title = this.title;
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
      console.log(noteId);
      const path = (replaceNote ? '../' : '') + noteId;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }
}
