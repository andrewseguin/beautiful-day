import {Component} from '@angular/core';
import {AnalyticsService} from 'app/service/analytics.service';
import {HeaderService} from 'app/service/header.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Router} from '@angular/router';
import {UsersDao} from 'app/service/dao';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private analyticsService: AnalyticsService,
              private titleService: HeaderService,
              private snackBar: MatSnackBar,
              private router: Router,
              private usersDao: UsersDao,
              private auth: AngularFireAuth) {
    this.titleService.observeChanges();
    this.analyticsService.setupGoogleAnalytics();
    this.auth.authState.subscribe(auth => {
      if (!auth) {
        this.navigateToLogin();
        return;
      }

      this.usersDao.addUserData(auth);
      this.notifyLoggedInAs(auth.email);
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
