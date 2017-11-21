import { Injectable } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable()
export class HeaderService {
  _title: string;

  constructor(private titleService: Title) { }

  set title(title: string) {
    this.titleService.setTitle(title);
    this._title = title;
  }
  get title(): string { return this._title; }
}
