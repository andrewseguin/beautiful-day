import { Injectable } from '@angular/core';
import {environment} from 'environments/environment';
import {NavigationEnd, Router} from '@angular/router';
declare let ga: Function;

@Injectable()
export class AnalyticsService {

  constructor(private router: Router) {}

  setupGoogleAnalytics() {
    this.router.events.distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    }).subscribe((x: any) => {
      this.sendPageview(x.url);
    });
  }

  private sendPageview(url): void {
    if (!environment.production) { return; }
    ga('send', 'pageview', url);
  }

  private sendEvent(category: string, action: string, label: string, value: number): void {
    if (!environment.production) { return; }
    ga('send', 'event', category, action, label, value);
  }
}
