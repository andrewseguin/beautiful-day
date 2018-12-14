import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import * as firebase from 'firebase/app';

if (environment.production) {
  enableProdMode();
}

if (localStorage.getItem('dark') === 'true') {
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
}

platformBrowserDynamic().bootstrapModule(AppModule);
