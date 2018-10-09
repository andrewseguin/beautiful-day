import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RequestsRenderer} from 'app/ui/pages/shared/requests-list/render/requests-renderer';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {
  Filter,
  FilterType, Query
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {animate, style, transition, trigger} from '@angular/animations';
import {ANIMATION_DURATION} from 'app/ui/shared/animations';

export const FILTER_TYPE_LABELS = new Map<FilterType, string>([
  ['project', 'Project'],
  ['purchaser', 'Purchaser'],
  ['cost', 'Cost'],
]);

@Component({
  selector: 'requests-search',
  templateUrl: 'requests-search.component.html',
  styleUrls: ['requests-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-filters]': 'requestsRenderer.options.filters.length'
  },
  animations: [
    trigger('expand', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate(ANIMATION_DURATION, style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate(ANIMATION_DURATION, style({ height: '0', opacity: 0 })),
      ]),
    ]),
  ]
})
export class RequestsSearchComponent {
  search = new FormControl('');
  destroyed = new Subject();

  filterTypeLabels = FILTER_TYPE_LABELS;
  filterTypes = Array.from(this.filterTypeLabels.keys());

  constructor (public requestsRenderer: RequestsRenderer) {}

  ngOnInit() {
    this.search.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroyed))
      .subscribe(value => {
        this.requestsRenderer.options.search = value;
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addFilter(type: FilterType) {
    const filters = this.requestsRenderer.options.filters.slice();
    filters.push({type, query: null});
    this.requestsRenderer.options.filters = filters;
  }

  remove(filter: Filter) {
    const filters = this.requestsRenderer.options.filters.slice();
    const index = filters.indexOf(filter);
    filters.splice(index, 1);
    this.requestsRenderer.options.filters = filters;
  }

  queryChange(filter: Filter, query: Query) {
    const filters = this.requestsRenderer.options.filters.slice();
    const index = filters.indexOf(filter);
    filters[index].query = query;
    this.requestsRenderer.options.filters = filters;
  }
}
