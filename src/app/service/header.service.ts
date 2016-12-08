import { Injectable } from '@angular/core';

@Injectable()
export class HeaderService {
  _title: string;

  constructor() { }

  set title(value: string) { this._title = value; }
  get title(): string { return this._title; }
}
