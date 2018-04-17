import {Component} from '@angular/core';
import {AnalyticsService} from 'app/service/analytics.service';
import {AuthService} from 'app/service/auth-service';
import {TitleService} from 'app/service/header.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(private analyticsService: AnalyticsService,
              private authService: AuthService,
              private titleService: TitleService) {
    this.titleService.observeChanges();
    this.analyticsService.setupGoogleAnalytics();
    this.authService.watchState();
  }
}
