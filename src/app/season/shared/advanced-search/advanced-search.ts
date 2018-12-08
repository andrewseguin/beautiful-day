import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import {ANIMATION_DURATION} from 'app/utility/animations';
import {Query} from 'app/season/utility/search/query';
import {ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';
import {Filter, IFilterMetadata} from 'app/season/utility/search/filter';

@Component({
  selector: 'advanced-search',
  templateUrl: 'advanced-search.html',
  styleUrls: ['advanced-search.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-filters]': 'hasDisplayedFilters()'
  },
  animations: [
    trigger('expand', [
      transition('void => true', [
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
export class AdvancedSearch implements OnInit, AfterViewInit, OnDestroy {
  searchFormControl = new FormControl('');
  destroyed = new Subject();

  autocomplete = new Map<string, Observable<string[]>>();

  focusInput = false;

  expandState = false;

  displayedFilterTypes: string[];

  trackByIndex = i => i;

  @Input() metadata: Map<string, IFilterMetadata>;

  @Input() filters: Filter[] = [];

  @Input()
  set search(v: string) { this.searchFormControl.setValue(v, {emitEvent: false}); }
  get search(): string { return this.searchFormControl.value; }

  @Output() searchChanged = new EventEmitter<string>();

  @Output() filtersChanged = new EventEmitter<Filter[]>();

  constructor (private projectsDao: ProjectsDao,
               private requestsDao: RequestsDao,
               private itemsDao: ItemsDao) { }

  ngOnInit() {
    this.metadata.forEach((value, key) => {
      if (value.autocomplete) {
        this.autocomplete.set(key, value.autocomplete({
          itemsDao: this.itemsDao,
          requestsDao: this.requestsDao,
          projectsDao: this.projectsDao
        }));
      }
    });

    this.searchFormControl.valueChanges.pipe(
      debounceTime(100),
      takeUntil(this.destroyed))
      .subscribe(value => {
        this.searchChanged.emit(value);
      });

    this.displayedFilterTypes =
      Array.from(this.metadata.keys())
        .filter(key => this.metadata.get(key).displayName)
        .sort((a, b) => {
          const nameA = this.metadata.get(a).displayName;
          const nameB = this.metadata.get(b).displayName;
          return nameA < nameB ? -1 : 1;
        });
  }

  ngAfterViewInit() {
    this.expandState = true;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addFilter(type: string) {
    this.focusInput = true;
    const filters = this.filters.slice();
    filters.push({type, query: null});
    this.filtersChanged.emit(filters);
  }

  removeFilter(index: number) {
    const filters = this.filters.slice();
    filters.splice(index, 1);
    this.filtersChanged.emit(filters);
  }

  queryChange(index: number, query: Query) {
    const filters = this.filters.slice();
    filters[index] = {...filters[index], query};
    this.filtersChanged.emit(filters);
  }

  hasDisplayedFilters() {
    return this.filters.some(filter => !filter.isImplicit);
  }
}
