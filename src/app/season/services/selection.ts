import {Injectable} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class Selection {
  items = new SelectionModel<string>(true);
  requests = new SelectionModel<string>(true);

  private destroyed = new Subject();

  constructor(private router: Router) {
    this.router.events.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.items.clear();
      this.requests.clear();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
