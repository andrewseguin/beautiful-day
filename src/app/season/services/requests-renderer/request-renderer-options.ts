import {Subject} from 'rxjs';
import {Filter} from './filter';

export type Group = 'all' | 'category' | 'project' | 'date' |
                    'dropoff' | 'tags' | 'item';

export type Sort = 'requestAdded' | 'itemCost' | 'itemName' |
                   'requestCost' | 'dropoffDate';

export interface RequestRendererOptionsState {
  filters: Filter[];
  search: string;
  grouping: Group;
  sorting: Sort;
  reverseSort: boolean;
  showProjectName: boolean;
}

export class RequestRendererOptions {
  set filters(v: Filter[]) {
    if (this._filters === v) { return; }
    this._filters = v;
    this.changed.next();
  }
  get filters(): Filter[] { return this._filters; }
  private _filters: Filter[] = [];

  set search(v: string) {
    if (this._search === v) { return; }
    this._search = v;
    this.changed.next();
  }
  get search(): string { return this._search; }
  private _search = '';

  set grouping(v: Group) {
    if (this._grouping === v) { return; }
    this._grouping = v;
    this.changed.next();
  }
  get grouping(): Group { return this._grouping; }
  private _grouping: Group = 'all';

  set sorting(v: Sort) {
    if (this._sorting === v) { return; }
    this._sorting = v;
    this.changed.next();
  }
  get sorting(): Sort { return this._sorting; }
  private _sorting: Sort = 'requestAdded';

  set reverseSort(v: boolean) {
    if (this._reverseSort === v) { return; }
    this._reverseSort = v;
    this.changed.next();
  }
  get reverseSort(): boolean { return this._reverseSort; }
  private _reverseSort = false;

  set showProjectName(v: boolean) {
    if (this._showProjectName === v) { return; }
    this._showProjectName = v;
    this.changed.next();
  }
  get showProjectName(): boolean { return this._showProjectName; }
  private _showProjectName = false;

  changed = new Subject<void>();

  setState(options: RequestRendererOptionsState) {
    this._filters = options.filters;
    this._search = options.search;
    this._grouping = options.grouping;
    this._sorting = options.sorting;
    this._reverseSort = options.reverseSort;
    this._showProjectName = options.showProjectName;
    this.changed.next();
  }

  getState() {
    return {
      filters: this.filters,
      search: this.search,
      grouping: this.grouping,
      sorting: this.sorting,
      reverseSort: this.reverseSort,
      showProjectName: this.showProjectName,
    };
  }
}

export function areOptionStatesEqual(o1: RequestRendererOptionsState,
                                     o2: RequestRendererOptionsState) {
  return o1.grouping === o2.grouping &&
    o1.reverseSort === o2.reverseSort &&
    o1.sorting === o2.sorting &&
    o1.showProjectName === o2.showProjectName &&
    o1.search === o2.search &&
    JSON.stringify(o1.filters.sort()) === JSON.stringify(o2.filters.sort());
}
