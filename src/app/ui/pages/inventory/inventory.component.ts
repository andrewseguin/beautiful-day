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
  _search = 'putty knife';

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
    const clonedItem: Item = {
      name: item.name,
      categories: item.categories,
      url: item.url,
      cost: item.cost,
      keywords: item.keywords
    };

    this.editing.set(item.$key, clonedItem);
  }

  handleEditableItemCellEvent(event: EditableItemCellAction, item: Item) {
    switch (event) {
      case 'save': this.save(item.$key); break;
      case 'cancel': this.editing.delete(item.$key); break;
      case 'edit': this.editItem(item);
    }
  }

  save(itemId: string) {
    this.itemsService.update(itemId, this.editing.get(itemId));
    this.editing.delete(itemId);
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
    this.editing.get(item.$key).categories = categories.join(',');

    if (e.keyCode === 13 /* Enter */) {
      this.save(item.$key);
    }
  }

  setIsApproved(item: Item, isApproved: boolean) {
    this.itemsService.update(item.$key, {isApproved: isApproved});
  }
}
