import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import {ANIMATION_DURATION} from 'app/utility/animations';
import {Query} from 'app/season/services/requests-renderer/query';
import {FilterMetadata, FilterType} from 'app/season/services/requests-renderer/filter';

@Component({
  selector: 'requests-search',
  templateUrl: 'requests-search.html',
  styleUrls: ['requests-search.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-filters]': 'hasDisplayedFilters()'
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
export class RequestsSearch {
  search = new FormControl('');
  destroyed = new Subject();

  filterMetadata = FilterMetadata;
  displayedFilterTypes =
      Array.from(FilterMetadata.keys()).filter(key => FilterMetadata.get(key).displayName);

  trackByIndex = i => i;

  constructor (public requestsRenderer: RequestsRenderer,
               private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.search.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroyed))
      .subscribe(value => {
        this.requestsRenderer.options.search = value;
      });

    this.requestsRenderer.options.changed.pipe(
      takeUntil(this.destroyed))
      .subscribe(() => {
        this.search.setValue(this.requestsRenderer.options.search);
        this.cd.detectChanges(); // In case filters changed as well
      });

    this.search.setValue(this.requestsRenderer.options.search);
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

  removeFilter(index: number) {
    const filters = this.requestsRenderer.options.filters.slice();
    filters.splice(index, 1);
    this.requestsRenderer.options.filters = filters;
  }

  queryChange(index: number, query: Query) {
    const filters = this.requestsRenderer.options.filters.slice();
    filters[index] = {...filters[index], query};
    this.requestsRenderer.options.filters = filters;
  }

  hasDisplayedFilters() {
    return this.requestsRenderer.options.filters.some(filter => !filter.isImplicit);
  }
}
