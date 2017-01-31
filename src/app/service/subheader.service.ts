import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class SubheaderService {
  visibilitySubject = new BehaviorSubject<boolean>(true);

  constructor(private router: Router) {
    this.router.events.subscribe(() => this.visibility(true));
    window.addEventListener('resize', () => { this.visibility(true) });
  }

  visibility(v: boolean) {
    this.visibilitySubject.next(v);
  }
}
