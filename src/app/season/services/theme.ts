import {Injectable} from '@angular/core';

@Injectable()
export class Theme {
  isDark: boolean;

  constructor() {
    this.syncState();
  }

  toggle() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.syncState();

    localStorage.setItem('dark', String(this.isDark));
  }

  private syncState() {
    this.isDark = document.body.classList.contains('dark-theme');
  }
}
