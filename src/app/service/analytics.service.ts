import { Injectable } from '@angular/core';
declare let ga:Function;

@Injectable()
export class AnalyticsService {

  constructor() { }

  sendPageview(url): void {
    ga('send', 'pageview', url);
  }

  sendEvent(category: string, action: string, label: string, value: number): void {
    ga('send', 'event', category, action, label, value);
  }
}
