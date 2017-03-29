import { Injectable } from '@angular/core';

@Injectable()
export class MediaQueryService {

  constructor() { }

  isMobile(): boolean {
    return window.matchMedia('(max-width: 700px)').matches;
  }
}
