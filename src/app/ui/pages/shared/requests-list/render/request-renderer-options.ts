import {Subject} from 'rxjs';

export type Group = 'all' | 'category' | 'project' | 'date' |
                    'dropoff' | 'tags' | 'item';

export type Sort = 'request added' | 'item cost' | 'item name' |
                   'request cost' | 'date needed' | 'purchaser';

export type FilterType = 'project' | 'purchaser' | 'dropoff date' |
                         'request cost' | 'projectKey' | 'item cost' |
                         'dropoff location';

export type Query = FilterProjectQuery | FilterCostQuery | FilterDateQuery |
                    FilterPurchaserQuery | FilterProjectKeyQuery | FilterDropoffLocationQuery;

export interface FilterProjectQuery {
  project: string;
}

export interface FilterPurchaserQuery {
  purchaser: string;
}

export interface FilterProjectKeyQuery {
  key: string;
}

export type CostEquality = 'greater than' | 'less than' | 'equal to';
export interface FilterCostQuery {
  equality: CostEquality;
  cost: number;
}

export type DateEquality = 'before' | 'after' | 'on';
export interface FilterDateQuery {
  equality: DateEquality;
  date: number;
}

export interface FilterDropoffLocationQuery {
  location: string;
}

export interface Filter {
  type: FilterType;
  query?: Query;
  isImplicit?: boolean;
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
  private _sorting: Sort = 'request added';

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

  absorb(options: RequestRendererOptions) {
    this._filters = options.filters;
    this._grouping = options.grouping;
    this._sorting = options.sorting;
    this._reverseSort = options.reverseSort;
    this._showProjectName = options.showProjectName;
    this.changed.next();
  }
}
