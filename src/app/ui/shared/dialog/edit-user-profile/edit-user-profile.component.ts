import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {User} from "../../../../model/user";
import {UsersService} from "../../../../service/users.service";

@Component({
  selector: 'edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent {
  name = '';
  phone = '';

  _user: User;
  set user(user: User) {
    this._user = user;
    this.name = user.name;
    this.phone = user.phone;
  }
  get user(): User { return this._user; }

  constructor(private dialogRef: MdDialogRef<EditUserProfileComponent>,
              private usersService: UsersService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.usersService.update(this.user.uid, {name: this.name, phone: this.phone});
    this.close();
  }
}