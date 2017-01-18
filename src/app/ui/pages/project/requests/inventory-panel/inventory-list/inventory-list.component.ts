import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {Item} from "../../../../../../model/item";
import {EditItemComponent} from "../../../../../shared/dialog/edit-item/edit-item.component";
import {MdDialog} from "@angular/material";
import {ItemsService} from "../../../../../../service/items.service";
import {ItemSearchPipe} from "../../../../../../pipe/item-search.pipe";

/** Number of items to load each time. */
const ITEMS_TO_LOAD = 20;

@Component({
  selector: 'inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  loadingValue: number = 0;
  loadingInterval: number;

  itemSearch = new ItemSearchPipe();

  itemsToShow: number;
  items: Item[] = [];
  filteredItems: Item[];

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

  constructor(private mdDialog: MdDialog,
              private itemsService: ItemsService) {}

  ngOnInit() {
    this.itemsService.getItems().subscribe(items => {
      this.items = items;
      this.filterItems();
    });
  }

  filterItems() {
    this.filteredItems = this.items;

    if (this.category) {
      this.filteredItems =
          this.items.filter(item => item.category == this.category);
    }

    if (this.search) {
      this.filteredItems =
          this.itemSearch.transform(this.filteredItems, this.search);
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
    const dialogRef = this.mdDialog.open(EditItemComponent);

    if (this.category) {
      dialogRef.componentInstance.item = {category: this.category};
      dialogRef.componentInstance.disableCategory = true;
    }

    dialogRef.componentInstance.mode = 'new';
  }

  itemTrackBy(i: number, item: Item) {
    return item.$key;
  }
}
