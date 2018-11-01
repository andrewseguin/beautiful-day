import { Injectable } from '@angular/core';
import {environment} from 'environments/environment';
import {NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged} from 'rxjs/operators';
declare let ga: Function;

@Injectable()
export class Analytics {

  constructor(private router: Router) {}

  setupGoogleAnalytics() {
    this.router.events.pipe(distinctUntilChanged((previous: any, current: any) => {
      if (current instanceof NavigationEnd) {
        return previous.url === current.url;
      }
      return true;
    })).subscribe(x => {
      this.sendPageview(x);
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
