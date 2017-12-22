import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {NotesService} from 'app/service/notes.service';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.scss']
})
export class DeleteNoteComponent {
  _onDelete: Subject<void> = new Subject<void>();
  noteId: string;
  title: string;

  constructor(private dialogRef: MatDialogRef<DeleteNoteComponent>,
              private notesService: NotesService) { }

  close() {
    this.dialogRef.close();
  }

  deleteNote() {
    this.notesService.remove(this.noteId);
    this._onDelete.next();
    this.close();
  }

  onDelete(): Observable<void> {
    return this._onDelete.asObservable();
  }
}
