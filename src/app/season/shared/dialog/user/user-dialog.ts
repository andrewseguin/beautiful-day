import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {AngularFireAuth} from '@angular/fire/auth';
import {User, UsersDao} from 'app/service/users-dao';
import {
  EditUserProfile,
  EditUserProfileData,
  EditUserProfileResult
} from './edit-user-profile/edit-user-profile';
import {sendEvent} from 'app/utility/analytics';

@Injectable()
export class UserDialog {
  constructor(private dialog: MatDialog,
              private afAuth: AngularFireAuth,
              private usersDao: UsersDao) {}

  editProfile(user: User) {
    const data: EditUserProfileData = {
      name: user.name,
      phone: user.phone,
    };

    this.dialog.open(EditUserProfile, {data, width: '360px'}).afterClosed().pipe(
        take(1))
        .subscribe((result: EditUserProfileResult) => {
        if (result) {
          sendEvent('user_profile', 'updated');
          this.usersDao.update(user.id, {
            name: result.name,
            phone: result.phone
          });
        }
    });
  }
}
