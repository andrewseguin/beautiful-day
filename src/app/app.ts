import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalConfigDao } from 'app/service/global-config-dao';
import { UsersDao } from 'app/service/users-dao';
import { distinctUntilChanged } from 'rxjs/operators';
import { sendPageview } from './utility/analytics';

export const APP_VERSION = 9;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor(
      private snackBar: MatSnackBar, private router: Router,
      private usersDao: UsersDao, private globalConfigDao: GlobalConfigDao,
      private afAuth: AngularFireAuth) {
    console.log(`v.${APP_VERSION}`);

    this.globalConfigDao.map.subscribe(map => {
      if (map) {
        const dbAppVersion = map.get('appVersion').value;
        if (dbAppVersion > APP_VERSION) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(r => r.unregister());
            location.reload();
          });
        }
      }
    });

    this.router.events
        .pipe(distinctUntilChanged((prev: any, curr: any) => {
          if (curr instanceof NavigationEnd) {
            return prev.urlAfterRedirects === curr.urlAfterRedirects;
          }
          return true;
        }))
        .subscribe(x => sendPageview(x.urlAfterRedirects));

    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.navigateToLogin();
        return;
      } else {
        // Add or update the users profile in the db
        this.usersDao.addUserData(auth);
        this.notifyLoggedInAs(auth.email);
      }
    });
  }

  /**
   * Send user to the login page and send current location for when they are
   * logged in.
   */
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
