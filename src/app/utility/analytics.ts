import {environment} from 'environments/environment';
declare let ga: Function;

export function sendPageview(url: string): void {
  if (!environment.production) { return; }
  ga('send', 'pageview', url);
}

export function sendEvent(category: string, action: string, label?: string, value?: number): void {
  if (!environment.production) { return; }
  ga('send', 'event', category, action, label, value);
}
