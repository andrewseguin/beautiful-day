import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class SubheaderService {
  visibilitySubject: BehaviorSubject<boolean> =
      new BehaviorSubject<boolean>(true);

  constructor() { }

  visibility(v: boolean) {
    this.visibilitySubject.next(v);
  }
}
