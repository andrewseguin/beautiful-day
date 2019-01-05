import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersDao} from 'app/service/users-dao';
import {sendEvent} from 'app/utility/analytics';
import {Subject} from 'rxjs';
import {distinctUntilChanged, filter, map, mergeMap, take, takeUntil} from 'rxjs/operators';

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
          if (lightTheme != null) {
            if ((lightTheme && !this.isLight) ||
                (!lightTheme && this.isLight)) {
              this.toggle();
            }
          }
        });
  }

  toggle(userToggled = false) {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.syncState();

    localStorage.setItem('light', String(this.isLight));

    if (userToggled) {
      sendEvent('theme_toggled', this.isLight ? 'light' : 'dark');
    }

    this.afAuth.authState.pipe(take(1)).subscribe(auth => {
      this.usersDao.update(auth.uid, {lightTheme: this.isLight});
    });
  }

  private syncState() {
    this.isLight = document.body.classList.contains('light-theme');
  }
}
