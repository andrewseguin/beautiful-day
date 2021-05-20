import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Item, ItemsDao, RequestsDao, Request} from 'app/season/dao';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {Header, Selection} from 'app/season/services';
import {take, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {ItemFilterMetadata} from 'app/season/inventory-page/item-filter-metadata';
import {Filter} from 'app/season/utility/search/filter';
import {getItemsMatchingQuery} from 'app/season/utility/items-search';
import {SelectionModel} from '@angular/cdk/collections';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {DomSanitizer} from '@angular/platform-browser';
import {CdkScrollable} from '@angular/cdk/overlay';
import {CdkPortal} from '@angular/cdk/portal';
import {ItemDialog} from 'app/season/shared/dialog/item/item-dialog';
import {getItemsAsTsv} from '../utility/inventory-conversion';

interface EditableProperty {
  id: string;
  label: string;
  type?: 'currency' | 'array';
  alignEnd?: boolean;
  isStickyLeft?: boolean;
}

@Component({
  selector: 'inventory-page',
  templateUrl: 'inventory-page.html',
  styleUrls: ['inventory-page.scss'],
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPage {
  expanded = new SelectionModel<string>(true);
  hasExpanded = new Set<string>();
  filterMetadata = ItemFilterMetadata;

  set search(v: string) { this._search.next(v); }
  get search(): string { return this._search.value; }
  _search = new BehaviorSubject<string>('');

  set filters(v: Filter[]) { this._filters.next(v); }
  get filters(): Filter[] { return this._filters.value; }
  _filters = new BehaviorSubject<Filter[]>([]);

  trackBy = (_, item: Item) => item.id;

  editing: {item: string, prop: string} | null;

  editableProperties: EditableProperty[] = [
    {id: 'name', label: 'Name', isStickyLeft: true},
    {id: 'categories', label: 'Categories'},
    {id: 'keywords', label: 'Keywords'},
    {id: 'cost', label: 'Cost', alignEnd: true},
    {id: 'quantityOwned', label: 'Stock', alignEnd: true},
    {id: 'hidden', label: 'Hidden'},
    {id: 'approved', label: 'Approved'},
    {id: 'url', label: 'URL'},
  ];

  displayedColumns =
      ['select', 'name', 'categories', 'keywords', 'cost',
       'quantityOwned', 'dateCreated', 'dateModified',
       'approved', 'hidden', 'requests', 'url', 'showUrl'];

  dataSource = new MatTableDataSource<Item>();

  loading = true;

  requestCount: Map<string, number>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(CdkScrollable, { static: true }) scrollable: CdkScrollable;
  @ViewChild(CdkPortal, { static: true }) toolbarActions: CdkPortal;

  private _destroyed = new Subject();

  constructor (private itemsDao: ItemsDao,
               private requestsDao: RequestsDao,
               public itemDialog: ItemDialog,
               private cd: ChangeDetectorRef,
               private sanitizer: DomSanitizer,
               private header: Header,
               public selection: Selection) {
    this.selection.items.changed.pipe(
        takeUntil(this._destroyed))
        .subscribe(() => this.cd.markForCheck());

    this.expanded.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });

    combineLatest([this.itemsDao.list, this.requestsDao.list]).pipe(
      takeUntil(this._destroyed))
      .subscribe(result => {
        const items: Item[] = result[0];
        const requests: Request[] = result[1];

        if (!items || !requests) {
          return;
        }

        this.requestCount = new Map();
        items.forEach(item => {
          this.requestCount.set(item.id, requests.filter(r => r.item === item.id).length);
          this.cd.markForCheck();
        });
      });

  }

  ngOnInit() {
    this.header.toolbarOutlet.next(this.toolbarActions);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    const defaultAccessor = this.dataSource.sortingDataAccessor;
    this.dataSource.sortingDataAccessor = (item: Item, id: string) => {
      return id === 'requests' ?
          this.requestCount.get(item.id) : defaultAccessor(item, id);
    };

    const changes = [
      this.itemsDao.list,
      this._search,
      this._filters,
    ];
    combineLatest(changes).pipe(
        takeUntil(this._destroyed))
        .subscribe(result => {
          const items = result[0] as Item[];
          const search = result[1] as string;
          const filters = result[2] as Filter[];

          if (items) {
            this.loading = false;
          }

          const filteredItems = this.filter(items || [], filters);
          this.dataSource.data = getItemsMatchingQuery(filteredItems, search);
        });

    combineLatest([
      this._search,
      this._filters,
      this.sort.sortChange,
      this.paginator.page
    ]).pipe(takeUntil(this._destroyed))
        .subscribe(() => this.scrollable.scrollTo({top: 0}));

    this.sort.sortChange.subscribe(() => {
      this.paginator.firstPage();
    });
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this._destroyed.next();
    this._destroyed.complete();
  }

  save(item: Item, update: Item) {
    // Save the value on the item to render immediately.
    // Prevents a quick jank of showing old value before the update comes thru
    Object.keys(update).forEach(key => {
      item[key] = update[key];
    });

    this.itemsDao.update(item.id, update);
    this.editing = null;
  }

  setSelected(item: string, value: boolean) {
    value ?
      this.selection.items.select(item) :
      this.selection.items.deselect(item);
  }

  filter(items: Item[], filters: Filter[]) {
    return items.filter(item => {
      return filters.every(filter => {
        if (!filter.query) {
          return true;
        }

        return this.filterMetadata.get(filter.type).matcher({item}, filter.query);
      });
    });
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  addItem() {
    this.itemDialog.createItem('');
  }

  selectFilteredItems() {
    this.selection.items.select(...this.dataSource.data.map(i => i.id));
  }

  allFilteredItemsSelected() {
    if (!this.dataSource.data.length) {
      return false;
    }
    return this.dataSource.data.every(i => this.selection.items.isSelected(i.id));
  }

  exportToTsvFile() {
    this.itemsDao.list.pipe(take(1)).subscribe(items => {
      const filename = 'inventory';

      const text = getItemsAsTsv(items);

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
}
