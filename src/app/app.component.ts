import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from 'angularfire2';
import {Router, NavigationEnd} from '@angular/router';
import {MdSnackBarConfig, MdSnackBar} from "@angular/material";
import {AnalyticsService} from "./service/analytics.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: FirebaseAuth,
              private analyticsService: AnalyticsService,
              private mdSnackbar: MdSnackBar,
              private router: Router) {
    this.setupGoogleAnalytics();
  }

  ngOnInit() {
    this.auth.subscribe(auth => {
      if (!auth) {
        // Store a redirect for post-login. If the current path is login, do not make this redirect.
        let redirect = location.pathname != '/login' ? location.pathname : '';

        // Navigate to the login and pass it the current location
        // so that after login, it can redirect back.
        this.router.navigate(['login'], {fragment: redirect});
        return;
      } else {
        const snackbarConfig = new MdSnackBarConfig();
        snackbarConfig.duration = 2000;
        this.mdSnackbar.open(`Logged in as ${auth.auth.email}`, null, snackbarConfig);
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
