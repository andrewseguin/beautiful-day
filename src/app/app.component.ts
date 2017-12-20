import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {AnalyticsService} from 'app/service/analytics.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';

export const APP_VERSION = 17;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase,
              private analyticsService: AnalyticsService,
              private mdSnackbar: MatSnackBar,
              private router: Router) {
    this.setupGoogleAnalytics();
  }

  ngOnInit() {
    this.auth.authState.subscribe(auth => {
      if (!auth) {
        // Store a redirect for post-login. If the current path is login, do not make this redirect.
        let redirect = location.pathname !== '/login' ? location.pathname : '';

        // Navigate to the login and pass it the current location
        // so that after login, it can redirect back.
        this.router.navigate(['login'], {fragment: redirect});
        return;
      } else {
        const snackbarConfig = new MatSnackBarConfig();
        snackbarConfig.duration = 2000;
        this.mdSnackbar.open(`Logged in as ${auth.email}`, null, snackbarConfig);
      }
    });
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
