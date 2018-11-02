import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Group, Sort} from 'app/ui/season/shared/requests-list/render/request-renderer-options';
import {RequestsRenderer} from 'app/ui/season/shared/requests-list/render/requests-renderer';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'display-options-header',
  templateUrl: 'display-options-header.html',
  styleUrls: ['display-options-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptionsHeader {
  groups = new Map<Group, string>([
    ['all', 'None'],
    ['category', 'Category'],
    ['date', 'Date Needed'],
    ['dropoff', 'Dropoff Location'],
    ['tags', 'Tags'],
    ['item', 'Item'],
  ]);
  groupIds = Array.from(this.groups.keys());

  sorts: Sort[] = [
    'request added',
    'request cost',
    'item cost',
    'item name',
    'date needed',
    'purchaser'
  ];

  private destroyed = new Subject();

  constructor(public requestsRenderer: RequestsRenderer,
              private cd: ChangeDetectorRef) {
    this.requestsRenderer.options.changed
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.cd.markForCheck();
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  setSort(sort: Sort) {
    const options = this.requestsRenderer.options;
    if (options.sorting === sort) {
      options.reverseSort = !options.reverseSort;
    } else {
      options.sorting = sort;
      options.reverseSort = false;
    }
  }
}
