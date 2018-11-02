import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from 'app/model/item';
import {EditItem} from 'app/ui/season/shared/dialog/edit-item/edit-item';
import {MatDialog} from '@angular/material';
import {ItemSearchPipe} from 'app/pipe/item-search.pipe';
import {ItemsDao} from 'app/ui/season/dao';
import {getCategoryGroup} from 'app/utility/items-categorize';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/** Number of items to load each time. */
const ITEMS_TO_LOAD = 10;

@Component({
  selector: 'inventory-list',
  templateUrl: 'inventory-list.html',
  styleUrls: ['inventory-list.scss']
})
export class InventoryList implements OnInit {
  loadingValue = 0;
  loadingInterval: number;

  itemSearch = new ItemSearchPipe();

  itemsToShow: number;
  items: Item[] = [];
  allItems: Item[] = [];
  subcategories: string[];
  filteredItems: Item[];

  itemTrackBy = (_i, item: Item) => item.id;

  _category: string;
  @Input() set category(category: string) {
    this._category = category;

    this.clearLoading();
    this.filterItems();
    this.beginLoading();
  }
  get category(): string { return this._category; }

  _search: string;
  @Input() set search(search: string) {
    this._search = search;

    this.clearLoading();
    this.filterItems();
    this.beginLoading();
  }
  get search(): string { return this._search; }

  @Output() filteredItemCount: EventEmitter<number> = new EventEmitter<number>();

  private destroyed = new Subject();

  constructor(private mdDialog: MatDialog,
              private itemsDao: ItemsDao) {}

  ngOnInit() {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      if (!items) {
        return;
      }

      const group = getCategoryGroup(items, this.category);
      this.items = group.items;
      this.subcategories = group.subcategories;
      this.filterItems();
      this.beginLoading();
    });

    // For search - use all items in search
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      this.allItems = items;
      this.filterItems();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  filterItems() {
    this.filteredItems = this.items;

    // When searching, use all items
    if (this.search) {
      this.filteredItems = this.itemSearch.transform(this.allItems, this.search);
    }

    this.filteredItemCount.emit(this.filteredItems.length);
  }

  beginLoading() {
    // If less than the constant count, just show them without the loading
    if (this.filteredItems.length < 10) {
      this.itemsToShow = 10;
      this.loadingValue = -1;
      return;
    }

    this.itemsToShow = 0;
    this.loadMoreItems();
  }

  loadMoreItems() {
    this.loadingValue = 0;
    this.loadingInterval = window.setInterval(() => {
      this.loadingValue += Math.random() * 50;
      if (this.loadingValue >= 100) {
        this.clearLoading();
        this.itemsToShow += ITEMS_TO_LOAD;
      }
    }, 150);
  }

  clearLoading() {
    window.clearInterval(this.loadingInterval);
    this.loadingValue = -1;
  }

  createItem() {
    const dialogRef = this.mdDialog.open(EditItem);

    if (this.category) {
      dialogRef.componentInstance.item = {categories: [this.category]};
      dialogRef.componentInstance.disableCategory = true;
    }

    dialogRef.componentInstance.mode = 'new';
  }
}
