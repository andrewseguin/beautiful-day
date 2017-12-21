import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ItemsService} from 'app/service/items.service';
import {Item} from 'app/model/item';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HeaderService} from 'app/service/header.service';
import {ItemSearchPipe} from 'app/pipe/item-search.pipe';
import {
  EditableItemCellAction
} from './editable-item-cell-value/editable-item-cell-value.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, AfterViewInit {
  columns = ['editActions', 'consoleLog', 'categories', 'name', 'keywords',
    'cost', 'url', 'isApproved', 'addedBy', 'dateAdded', 'quantityOwned'];
  dataSource = new MatTableDataSource<Item>();
  items: Item[];
  itemSearch = new ItemSearchPipe();
  itemCategoryCache = new Map<Item, string[]>();
  editing = new Map<string, Item>();

  editableColumns = [
    { header: 'Categories', property: 'categories',    type: 'multi' },
    { header: 'Name',       property: 'name' },
    { header: 'Keywords',   property: 'keywords' },
    { header: 'Cost',       property: 'cost',          type: 'currency', align: 'after' },
    { header: 'Url',        property: 'url',           type: 'link' },
    { header: 'Owned',      property: 'quantityOwned', align: 'after' },
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  set search(search: string) {
    this._search = search;
    this.filterItems();
  }
  get search(): string { return this._search; }
  _search = '';

  constructor(private headerService: HeaderService,
              private itemsService: ItemsService) {
    this.dataSource.sortingDataAccessor = (item: Item, property: string) => {
      switch (property) {
        case 'cost':
        case 'dateAdded':
        case 'quantityOwned':
          return item[property] === undefined ? -1 : item[property];
        default:
          return item[property] === undefined ? 'ZZZ' : item[property];
      }
    };
  }

  itemTrackBy = (_, item: Item) => item.$key;

  ngOnInit() {
    this.headerService.title = 'Inventory';
    this.itemsService.items.subscribe(items => {
      this.items = items;
      this.filterItems();
      this.itemCategoryCache.clear();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterItems() {
    let items = this.items;
    if (this.search) {
      items = this.itemSearch.transform(this.items, this.search);
    }

    this.dataSource.data = items;
  }

  editItem(item: Item) {
    this.editing.set(item.$key, {...item});
  }

  handleEditableItemCellEvent(event: EditableItemCellAction, item: Item) {
    switch (event) {
      case 'save': this.save(item); break;
      case 'cancel': this.cancel(item); break;
      case 'edit': this.editItem(item); break;
    }
  }

  log(item: Item) {
    console.log(item);
  }

  private cancel(item: Item) {
    // Restore item properties
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].$key !== item.$key) { continue; }
      this.items[i] = this.editing.get(item.$key);
      this.editing.delete(item.$key);
      this.filterItems();
      break;
    }
  }

  private save(item: Item) {
    let {name, categories, url, keywords, cost} = item;
    name = name || '';
    categories = categories || '';
    url = url || '';
    keywords = keywords || '';
    cost = cost || 0;

    this.itemsService.update(item.$key, {name, categories, url, keywords, cost});
    this.editing.delete(item.$key);
  }

  setIsApproved(item: Item, isApproved: boolean) {
    this.itemsService.update(item.$key, {isApproved});
  }
}
