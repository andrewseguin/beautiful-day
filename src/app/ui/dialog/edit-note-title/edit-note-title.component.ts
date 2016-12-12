import {Component } from '@angular/core';
import {NotesService} from "../../../service/notes.service";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'app-edit-note-title',
  templateUrl: './edit-note-title.component.html',
  styleUrls: ['./edit-note-title.component.scss']
})
export class EditNoteTitleComponent {
  noteId: string;
  title: string;

  constructor(private dialogRef: MdDialogRef<EditNoteTitleComponent>,
              private notesService: NotesService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.notesService.update(this.noteId, {title: this.title});
    this.close();
  }
}
