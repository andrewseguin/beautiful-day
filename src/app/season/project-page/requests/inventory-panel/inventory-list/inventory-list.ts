import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Item, ItemsDao} from 'app/season/dao';
import {getCategoryGroup} from 'app/utility/items-categorize';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {getItemsMatchingQuery} from 'app/season/utility/items-search';
import {ItemDialog} from 'app/season/shared/dialog/item/item-dialog';

/** Number of items to load each time. */
const ITEMS_TO_LOAD = 10;

@Component({
  selector: 'inventory-list',
  templateUrl: 'inventory-list.html',
  styleUrls: ['inventory-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryList implements OnInit {
  itemsToShow: number;
  items: Item[] = [];
  allItems: Item[] = [];
  subcategories: string[];
  filteredItems: Item[];

  itemTrackBy = (_i, item: Item) => item.id;

  _category: string;
  @Input() set category(category: string) {
    this._category = category;
    this.filterItems();
  }
  get category(): string { return this._category; }

  _search: string;
  @Input() set search(search: string) {
    this._search = search;

    this.filterItems();
  }
  get search(): string { return this._search; }

  @Output() filteredItemCount: EventEmitter<number> = new EventEmitter<number>();

  private destroyed = new Subject();

  constructor(private dialog: MatDialog,
              private cd: ChangeDetectorRef,
              private itemDialog: ItemDialog,
              private itemsDao: ItemsDao) {}

  ngOnInit() {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      if (!items) {
        return;
      }

      // For search
      this.allItems = items;

      const group = getCategoryGroup(items, this.category);
      this.items = group.items;
      this.subcategories = group.subcategories;

      this.filterItems();

      this.itemsToShow = 10;
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
      this.filteredItems = getItemsMatchingQuery(this.allItems, this.search);
    }

    this.filteredItemCount.emit(this.filteredItems.length);
  }

  loadMoreItems() {
    this.itemsToShow += ITEMS_TO_LOAD;
    this.cd.markForCheck();
  }

  createItem() {
    this.itemDialog.createItem(this.category);
  }
}
