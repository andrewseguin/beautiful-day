import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
declare let ga: Function;

@Injectable()
export class AnalyticsService {

  constructor() { }

  sendPageview(url): void {
    if (!environment.production) { return; }
    ga('send', 'pageview', url);
  }

  sendEvent(category: string, action: string, label: string, value: number): void {
    if (!environment.production) { return; }
    ga('send', 'event', category, action, label, value);
  }
}
