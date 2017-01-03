import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";
import {UsersService} from "../../../../service/users.service";
import {User} from "../../../../model/user";
import {AdminsService} from "../../../../service/admins.service";

@Component({
  selector: 'edit-dates',
  templateUrl: './edit-dates.component.html',
  styleUrls: ['./edit-dates.component.scss']
})
export class EditDatesComponent {
  dates: string[];

  constructor(private dialogRef: MdDialogRef<EditDatesComponent>,
              private adminsService: AdminsService) {
    this.adminsService.getAdmins().subscribe(dates => this.dates = dates);
  }

  remove(index: number) {
    this.dates.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.adminsService.setAdmins(this.dates);
    this.close();
  }

  trackByIndex(index: number) {
    return index;
  }
}
