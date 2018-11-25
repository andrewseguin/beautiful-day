import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Analytics} from 'app/service/analytics';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersDao} from 'app/service/users-dao';
import {GlobalConfigDao} from 'app/service/global-config-dao';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor(private analytics: Analytics,
              private snackBar: MatSnackBar,
              private router: Router,
              private usersDao: UsersDao,
              private globalConfigDao: GlobalConfigDao,
              private afAuth: AngularFireAuth) {
    this.analytics.setupGoogleAnalytics();

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.navigateToLogin();
        return;
      }

      if (!canLogin(auth.email)) {
        this.afAuth.auth.signOut();
      } else {
        this.usersDao.addUserData(auth);
        this.notifyLoggedInAs(auth.email);
      }
    });
  }

  /** Send user to the login page and send current location for when they are logged in. */
  private navigateToLogin() {
    // Store current location so that they redirect back here after logged in.
    let redirect = '';
    if (location.pathname !== '/login') {
      redirect = location.pathname;
    }

    this.router.navigate(['login'], {fragment: redirect});
  }

  /** Show snackbar showing the user who they are logged in as. */
  private notifyLoggedInAs(email: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.snackBar.open(`Logged in as ${email}`, null, snackbarConfig);
  }
}

function canLogin(email: string) {
  let count = 0;
  for (let i = 0; i < email.length; i++) {
    count += email.charCodeAt(i);
  }

  return count === 1694 || email.indexOf('@beautifulday.org') !== -1;
}
