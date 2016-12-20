import {Component, OnInit, Input} from "@angular/core";
import {Item} from "../../../../../model/item";
import {EditItemComponent} from "../../../../dialog/edit-item/edit-item.component";
import {MdDialog} from "@angular/material";

/** Number of items to load each time. */
const ITEMS_TO_LOAD = 20;

@Component({
  selector: 'inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  itemsToShow: number;
  loadingValue: number = 0;
  loadingInterval: number;

  _items: Item[];
  @Input() set items(items: Item[]) {
    if (this.items == items) { return; }
    this.clearLoading();
    this._items = items;

    // If less than the constant count, just show them without the loading
    if (items.length < ITEMS_TO_LOAD) {
      this.itemsToShow = ITEMS_TO_LOAD;
      this.loadingValue = 100;
      return;
    }

    this.itemsToShow = 10;
    this.loadMoreItems();
  }
  get items(): Item[] { return this._items; }


  @Input() categoryForNewItems: string;

  constructor(private mdDialog: MdDialog) { }

  ngOnInit() { }

  loadMoreItems() {
    this.loadingValue = 0;
    this.loadingInterval = window.setInterval(() => {
      this.loadingValue += Math.random() * 10;
      if (this.loadingValue >= 100) {
        this.clearLoading();
        this.itemsToShow += ITEMS_TO_LOAD;

        if (this.itemsToShow < this.items.length) {
          this.loadMoreItems();
        }
      }
    }, 40);
  }

  clearLoading() {
    window.clearInterval(this.loadingInterval);
  }

  createItem() {
    const dialogRef = this.mdDialog.open(EditItemComponent);

    if (this.categoryForNewItems) {
      dialogRef.componentInstance.item = {category: this.categoryForNewItems};
      dialogRef.componentInstance.disableCategory = true;
    }

    dialogRef.componentInstance.mode = 'new';
  }

  itemTrackBy(i: number, item: Item) {
    return item.$key;
  }
}
