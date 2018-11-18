import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, pipe, Subject} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import {ANIMATION_DURATION} from 'app/utility/animations';
import {Query} from 'app/season/services/requests-renderer/query';
import {FilterMetadata} from 'app/season/services/requests-renderer/filter';
import {ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';

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
      Array.from(FilterMetadata.keys())
          .filter(key => FilterMetadata.get(key).displayName).sort();

  autocomplete = new Map<string, Observable<string[]>>();

  focusInput = false;

  trackByIndex = i => i;

  constructor (public requestsRenderer: RequestsRenderer,
               private projectsDao: ProjectsDao,
               private requestsDao: RequestsDao,
               private itemsDao: ItemsDao,
               private cd: ChangeDetectorRef) {
    FilterMetadata.forEach((value, key) => {
      if (value.autocomplete) {
        this.autocomplete.set(key, value.autocomplete({
          itemsDao, requestsDao, projectsDao
        }));
      }
    });
  }

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

  addFilter(type: string) {
    this.focusInput = true;
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
