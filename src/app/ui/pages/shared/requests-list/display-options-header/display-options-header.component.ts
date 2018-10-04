import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Group, Sort, View} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {RequestsRenderer} from 'app/ui/pages/shared/requests-list/render/requests-renderer';

@Component({
  selector: 'display-options-header',
  templateUrl: './display-options-header.component.html',
  styleUrls: ['./display-options-header.component.scss'],
  host: {
    'class': 'mat-elevation-z1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayOptionsHeaderComponent {
  groups: {id: Group, label: string}[] = [
    { id: 'all', label: 'All'},
    { id: 'category', label: 'Category'},
    { id: 'date', label: 'Date Needed'},
    { id: 'dropoff', label: 'Dropoff Location'},
    { id: 'tags', label: 'Tags'},
    { id: 'item', label: 'Item'},
  ];

  sorts: Sort[] = [
    'request added',
    'request cost',
    'item cost',
    'item name',
    'date needed',
    'purchaser'
  ];

  views: View[] = ['cost', 'dropoff', 'notes', 'tags'];

  constructor(private requestsRenderer: RequestsRenderer,
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

  toggleView(view: View) {
    const views = this.requestsRenderer.options.view.slice();
    const index = views.indexOf(view);
    if (index === -1) {
      views.push(view);
    } else {
      views.splice(index, 1);
    }

    this.requestsRenderer.options.view = views;
  }

  isViewSelected(view: View) {
    return this.requestsRenderer.options.view.indexOf(view) != -1;
  }
}
