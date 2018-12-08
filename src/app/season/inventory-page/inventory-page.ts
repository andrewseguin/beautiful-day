import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Item, ItemsDao} from 'app/season/dao';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Selection} from 'app/season/services';
import {takeUntil} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Subject} from 'rxjs';
import {ItemFilterMetadata} from 'app/season/inventory-page/item-filter-metadata';
import {Filter} from 'app/season/utility/search/filter';
import {getItemsMatchingQuery} from 'app/season/utility/items-search';
import {SelectionModel} from '@angular/cdk/collections';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {ItemDialog} from 'app/season/shared/dialog/item/item-dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {CdkScrollable} from '@angular/cdk/overlay';

interface EditableProperty {
  id: string;
  label: string;
  type?: 'currency';
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
    {id: 'cost', label: 'Cost', alignEnd: true, type: 'currency'},
    {id: 'quantityOwned', label: 'Stock', alignEnd: true},
    {id: 'hidden', label: 'Hidden'},
    {id: 'url', label: 'URL'},
  ];

  displayedColumns =
      ['select', 'name', 'categories', 'cost', 'quantityOwned', 'hidden', 'url', 'showUrl'];

  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(CdkScrollable) scrollable: CdkScrollable;

  private _destroyed = new Subject();

  constructor (private itemsDao: ItemsDao,
               private cd: ChangeDetectorRef,
               private sanitizer: DomSanitizer,
               private selection: Selection) {
    this.selection.items.changed.pipe(
        takeUntil(this._destroyed))
        .subscribe(() => this.cd.markForCheck());

    this.expanded.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    const changes = [
      this.itemsDao.list,
      this._search,
      this._filters,
    ];
    combineLatest(changes).pipe(
        takeUntil(this._destroyed))
        .subscribe(result => {
          const items = result[0];
          const search = result[1];
          const filters = result[2];

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
    })
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  save(item: Item, property: string, value: string) {
    const update = {};
    if (property === 'categories') {
      update[property] = value.split(',');
    } else {
      update[property] = value;
    }

    this.itemsDao.update(item.id, update);
    this.editing = null;

    // For UI purposes, save the value on the item to render immediately.
    // Prevents a quick jank of showing old value before the update comes thru
    item[property] = value;
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
}
