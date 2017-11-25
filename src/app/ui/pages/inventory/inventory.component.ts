import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ItemsService} from '../../../service/items.service';
import {Item} from '../../../model/item';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HeaderService} from '../../../service/header.service';
import {ItemSearchPipe} from '../../../pipe/item-search.pipe';
import {EditableItemCellAction} from './editable-item-cell-value/editable-item-cell-value.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, AfterViewInit {
  columns = ['editActions', 'categories', 'name', 'keywords', 'cost', 'url', 'isApproved', 'addedBy', 'dateAdded', 'quantityOwned'];
  dataSource = new MatTableDataSource<Item>();
  items: Item[];
  itemSearch = new ItemSearchPipe();
  itemCategoryCache = new Map<Item, string[]>();
  editing = new Map<string, Item>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  set search(search: string) {
    this._search = search;
    this.filterItems();
  }
  get search(): string { return this._search; }
  _search = '';

  constructor(private headerService: HeaderService,
              private itemsService: ItemsService) { }

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
    const {name, categories, url, keywords} = item;

    this.itemsService.update(item.$key, {name, categories, url, keywords});
    this.editing.delete(item.$key);
  }

  getCategories(item: Item) {
    if (!this.itemCategoryCache.has(item)) {
      this.itemCategoryCache.set(item, item.categories.split(','));
    }

    return this.itemCategoryCache.get(item);
  }

  saveCategory(item: Item, categoryIndex: number, e: KeyboardEvent) {
    const categories = item.categories.split(',');
    categories[categoryIndex] = (<HTMLInputElement>e.target).value;
    item.categories = categories.join(',');

    switch (e.keyCode) {
      case 13: this.save(item); break;
      case 27: this.cancel(item); break;
    }
  }

  setIsApproved(item: Item, isApproved: boolean) {
    this.itemsService.update(item.$key, {isApproved});
  }
}
