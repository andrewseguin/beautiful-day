import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {User} from 'app/model/user';
import {UsersService} from 'app/service/users.service';
import {AuthService} from '../../../../../service/auth-service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent {
  user: User;
  name = '';
  phone = '';

  constructor(private dialogRef: MatDialogRef<EditUserProfileComponent>,
              private authService: AuthService,
              private usersService: UsersService) {
    this.authService.user.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.name = user.name;
      this.phone = user.phone;
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.usersService.update(this.user.uid, {name: this.name, phone: this.phone});
    this.close();
  }
}
