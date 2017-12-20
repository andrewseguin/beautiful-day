import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AnalyticsService} from 'app/service/analytics.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

export const APP_VERSION = 17;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private auth: AngularFireAuth,
              private analyticsService: AnalyticsService,
              private mdSnackbar: MatSnackBar,
              private router: Router) {
    this.setupGoogleAnalytics();
    this.unregisterServiceWorkers();
  }

  ngOnInit() {
    this.auth.authState.subscribe(auth => {
      auth ? this.notifyLoggedInAs(auth.email) : this.navigateToLogin();
    });
  }

  /**
   * Unregister all service workers to set up for the time when we want to use Angular's official
   * worker without worrying about issues.
   */
  unregisterServiceWorkers() {
    if ('serviceWorker' in navigator) {
      navigator['serviceWorker'].getRegistrations()
        .then(registrations => registrations.forEach(r => r.unregister()));
    }
  }

  /** Send user to the login page and send current location for when they are logged in. */
  navigateToLogin() {
    // Store current location so that they redirect back here after logged in.
    let redirect = '';
    if (location.pathname !== '/login') {
      redirect = location.pathname;
    }

    this.router.navigate(['login'], {fragment: redirect});
  }

  /** Show snackbar showing the user who they are logged in as. */
  notifyLoggedInAs(email: string) {
    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Logged in as ${email}`, null, snackbarConfig);
  }

  setupGoogleAnalytics() {
    this.router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      this.analyticsService.sendPageview(x.url);
    });
  }
}
