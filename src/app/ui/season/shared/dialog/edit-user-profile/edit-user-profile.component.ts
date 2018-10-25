import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {User} from 'app/model/user';
import {mergeMap, take} from 'rxjs/operators';
import {UsersDao} from 'app/service/users-dao';
import {AngularFireAuth} from '@angular/fire/auth';
import {of} from 'rxjs';

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
              private afAuth: AngularFireAuth,
              private usersDao: UsersDao) {
    this.afAuth.authState.pipe(
        mergeMap(user => user ? this.usersDao.getByEmail(user.email) : of({} as User)),
        take(1))
        .subscribe(user => {
          this.user = user;
          this.name = user.name;
          this.phone = user.phone;
        });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.usersDao.update(this.user.uid, {name: this.name, phone: this.phone});
    this.close();
  }
}
