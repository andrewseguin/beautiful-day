import {Injectable} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';

@Injectable()
export class Selection {
  items = new SelectionModel<string>(true);
  requests = new SelectionModel<string>(true);

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.items.clear();
      this.requests.clear();
    });
  }
}
