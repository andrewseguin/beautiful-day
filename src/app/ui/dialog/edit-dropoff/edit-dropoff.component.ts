import { Component, OnInit } from '@angular/core';
import {RequestsService} from "../../../service/requests.service";
import {MdDialogRef} from "@angular/material";

@Component({
  selector: 'edit-dropoff',
  templateUrl: 'edit-dropoff.component.html',
  styleUrls: ['edit-dropoff.component.scss']
})
export class EditDropoffComponent implements OnInit {
  requestIds: Set<string>;
  dropoff: string;
  dateNeeded: string;

  constructor(private dialogRef: MdDialogRef<EditDropoffComponent>,
              private requestService: RequestsService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestService.update(requestId, {
        dropoff: this.dropoff,
        dateNeeded: this.dateNeeded
      });
    });
    this.close();
  }
}
