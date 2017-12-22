import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {User} from 'app/model/user';
import {UsersService} from 'app/service/users.service';

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

  constructor(private dialogRef: MatDialogRef<EditUserProfileComponent>,
              private usersService: UsersService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.usersService.update(this.user.uid, {name: this.name, phone: this.phone});
    this.close();
  }
}
