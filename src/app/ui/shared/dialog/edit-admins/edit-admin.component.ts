import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";
import {UsersService} from "../../../../service/users.service";
import {User} from "../../../../model/user";
import {AdminsService} from "../../../../service/admins.service";

@Component({
  selector: 'edit-admins',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent {
  admins: string[];

  constructor(private dialogRef: MdDialogRef<EditAdminComponent>,
              private adminsService: AdminsService) {
    this.adminsService.getAdmins().subscribe(admins => this.admins = admins);
  }

  remove(index: number) {
    this.admins.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.admins)
    this.adminsService.setAdmins(this.admins);
    this.close();
  }

  trackByIndex(index: number) {
    return index;
  }
}
