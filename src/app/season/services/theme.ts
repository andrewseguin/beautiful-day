import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersDao, User} from 'app/service/users-dao';
import {distinctUntilChanged, filter, map, mergeMap, take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class Theme {
  isLight: boolean;

  private destroyed = new Subject();

  constructor(private usersDao: UsersDao,
              private afAuth: AngularFireAuth) {
    this.syncState();
    this.afAuth.authState.pipe(
        filter(auth => !!auth),
        mergeMap(auth => this.usersDao.getByEmail(auth.email)),
        map(user => user ? user.lightTheme : null),
        distinctUntilChanged(),
        takeUntil(this.destroyed))
        .subscribe(lightTheme => {
          if (lightTheme != null && lightTheme && !this.isLight) {
            this.toggle();
          }
        });
  }

  toggle() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.syncState();

    localStorage.setItem('light', String(this.isLight));

    this.afAuth.authState.pipe(take(1)).subscribe(auth => {
      this.usersDao.update(auth.uid, {lightTheme: this.isLight});
    });
  }

  private syncState() {
    this.isLight = document.body.classList.contains('light-theme');
  }
}
