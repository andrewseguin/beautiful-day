import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';
import * as firebase from 'firebase/app';

if (environment.production) {
  enableProdMode();
}

if (localStorage.getItem('light') === 'true') {
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

platformBrowserDynamic().bootstrapModule(AppModule);
