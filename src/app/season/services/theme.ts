import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersDao} from 'app/service/users-dao';
import {distinctUntilChanged, map, mergeMap, take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class Theme {
  isDark: boolean;

  private destroyed = new Subject();

  constructor(private usersDao: UsersDao,
              private afAuth: AngularFireAuth) {
    this.syncState();
    this.afAuth.authState.pipe(
        takeUntil(this.destroyed),
        mergeMap(auth => this.usersDao.getByEmail(auth.email)),
        map(user => user ? user.darkTheme : null),
        distinctUntilChanged())
        .subscribe(darkTheme => {
          if (darkTheme != null && darkTheme && !this.isDark) {
            this.toggle();
          }
        });
  }

  toggle() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.syncState();

    localStorage.setItem('dark', String(this.isDark));

    this.afAuth.authState.pipe(take(1)).subscribe(auth => {
      this.usersDao.update(auth.uid, {darkTheme: this.isDark});
    });
  }

  private syncState() {
    this.isDark = document.body.classList.contains('dark-theme');
  }
}
