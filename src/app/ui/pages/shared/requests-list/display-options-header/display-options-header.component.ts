import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Group, Sort} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {RequestsRenderer} from 'app/ui/pages/shared/requests-list/render/requests-renderer';

@Component({
  selector: 'display-options-header',
  templateUrl: './display-options-header.component.html',
  styleUrls: ['./display-options-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptionsHeaderComponent {
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

  constructor(public requestsRenderer: RequestsRenderer,
              private cd: ChangeDetectorRef) {
    this.requestsRenderer.options.changed.subscribe(() => {
      this.cd.markForCheck();
    });
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
