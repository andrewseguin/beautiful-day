import {Injectable} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ESCAPE} from '@angular/cdk/keycodes';

@Injectable()
export class Selection {
  items = new SelectionModel<string>(true);
  requests = new SelectionModel<string>(true);

  private destroyed = new Subject();

  private handleEscape = (e: KeyboardEvent) => {
    if (e.keyCode === ESCAPE) {
      this.items.clear();
      this.requests.clear();
    }
  }

  constructor(private router: Router) {
    this.router.events.pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.items.clear();
      this.requests.clear();
    });

    document.body.addEventListener('keydown', this.handleEscape);
  }

  ngOnDestroy() {
    document.body.removeEventListener('keydown', this.handleEscape);

    this.destroyed.next();
    this.destroyed.complete();
  }
}
