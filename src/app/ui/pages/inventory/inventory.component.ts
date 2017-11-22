import {Component, OnInit} from '@angular/core';
import {ItemsService} from '../../../service/items.service';
import {Item} from '../../../model/item';
import {MatDialog} from '@angular/material';
import {EditItemComponent} from '../../shared/dialog/edit-item/edit-item.component';
import {HeaderService} from '../../../service/header.service';
import {ItemSearchPipe} from '../../../pipe/item-search.pipe';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  itemsToShow = 10;
  items: Item[];
  searchItems: Item[];
  categories: string[] = [];
  itemSearch = new ItemSearchPipe();

  _search = '';
  set search(search: string) {
    this._search = search;
    this.searchItems = this.itemSearch.transform(this.items, search);
  }
  get search(): string { return this._search; }

  constructor(private mdDialog: MatDialog,
              private headerService: HeaderService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.headerService.title = 'Inventory';

    this.itemsService.items.subscribe(items => {
      this.items = items;
      this.searchItems = this.itemSearch.transform(this.items, this.search);
    });

    this.itemsService.getItemsByCategory()
        .subscribe(categoryGroupCollection => {
          this.categories = Object.keys(categoryGroupCollection);
        });
  }

  ngOnDestroy() {
    this.itemsService.selection.clear();
  }

  categoryTrackBy(i: number, c: string) { return c; }

  getItemName(item: Item) {
    let name = item.name;
    if (item.type) {
      name += ` - ${item.type}`;
    }

    return name;
  }

  editItem(item: Item) {
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'edit';
    dialogRef.componentInstance.item = item;
  }

  openItemUrl(item: Item) {
    window.open(item.url);
  }

  isSelected(item: Item): boolean {
    return this.itemsService.selection.isSelected(item.$key);
  }

  setSelected(item: Item, checked: boolean) {
    const selection = this.itemsService.selection;
    checked ? selection.select(item.$key) : selection.deselect(item.$key);
  }

  hasAllSelectedItems(): boolean {
    return this.searchItems.every(item => {
      return this.itemsService.selection.isSelected(item.$key);
    });
  }

  toggleGroupSelection(select: boolean) {
    const itemKeys = this.searchItems.map(item => item.$key);
    this.itemsService.selection.select(...itemKeys);
  }
}
