import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Analytics} from 'app/service/analytics';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {GlobalConfigDao} from 'app/service/global-config-dao';
import {isValidLogin} from 'app/utility/valid-login';
import {UsersDao} from 'app/service/users-dao';

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
      } else if (isValidLogin(auth.email)) {
        // Add or update the users profile in the db
        this.usersDao.addUserData(auth);
        this.notifyLoggedInAs(auth.email);
      }
    });
  }

  /** Send user to the login page and send current location for when they are logged in. */
  private navigateToLogin() {
    if (location.pathname !== '/login') {
      this.router.navigate(['login'], {fragment: location.pathname});
    }
  }

  /** Show snackbar showing the user who they are logged in as. */
  private notifyLoggedInAs(email: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.snackBar.open(`Logged in as ${email}`, null, snackbarConfig);
  }
}
