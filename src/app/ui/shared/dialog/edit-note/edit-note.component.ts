import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent {
  requestIds: Set<string>;
  note: string = '';

  constructor(private dialogRef: MdDialogRef<EditNoteComponent>,
              private requestsService: RequestsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestsService.update(requestId, {note: this.note});
    });
    this.close();
    this.requestsService.clearSelected();
  }
}
