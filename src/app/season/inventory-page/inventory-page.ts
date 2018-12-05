import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {Item, ItemsDao} from 'app/season/dao';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Selection} from 'app/season/services';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {isMobile} from 'app/utility/media-matcher';

interface EditableProperty {
  id: string;
  label: string;
  type?: 'currency';
  alignEnd?: boolean;
  isSticky?: boolean;
}

@Component({
  templateUrl: 'inventory-page.html',
  styleUrls: ['inventory-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryPage {
  trackBy = (_, item: Item) => item.id;

  editing: {item: string, prop: string} | null;

  editableProperties: EditableProperty[] = [
    {id: 'name', label: 'Name', isSticky: !isMobile()},
    {id: 'categories', label: 'Categories'},
    {id: 'cost', label: 'Cost', alignEnd: true, type: 'currency'},
    {id: 'quantityOwned', label: 'Stock', alignEnd: true},
    {id: 'hidden', label: 'Hidden'},
    {id: 'url', label: 'URL'},
  ];

  displayedColumns =
      ['select', 'name', 'categories', 'cost', 'quantityOwned', 'hidden', 'url'];

  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _destroyed = new Subject();

  constructor (private itemsDao: ItemsDao,
               private cd: ChangeDetectorRef,
               private selection: Selection) {
    this.selection.items.changed.pipe(
        takeUntil(this._destroyed))
        .subscribe(() => this.cd.markForCheck());
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.itemsDao.list.subscribe(items => {
      this.dataSource.data = items || [];
    });
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
}
