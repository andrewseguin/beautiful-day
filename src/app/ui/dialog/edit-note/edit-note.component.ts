import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {Request} from "../../../model/request";
import {RequestsService} from "../../../service/requests.service";

@Component({
  selector: 'edit-note',
  templateUrl: 'edit-note.component.html',
  styleUrls: ['edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
  requestIds: Set<string>;
  note: string = '';

  constructor(private dialogRef: MdDialogRef<EditNoteComponent>,
              private requestService: RequestsService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestService.update(requestId, {note: this.note});
    });
    this.close();
  }
}
