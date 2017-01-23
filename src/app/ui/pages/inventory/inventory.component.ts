import {Component, OnInit} from "@angular/core";
import {ItemsService} from "../../../service/items.service";
import {Item} from "../../../model/item";
import {MdDialog} from "@angular/material";
import {EditItemComponent} from "../../shared/dialog/edit-item/edit-item.component";
import {HeaderService} from "../../../service/header.service";
import {PermissionsService} from "../../../service/permissions.service";
import {ItemSearchPipe} from "../../../pipe/item-search.pipe";

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  itemsToShow: number = 10;
  items: Item[];
  searchItems: Item[];
  canImportItems: boolean;
  categories: string[] = [];
  itemSearch = new ItemSearchPipe();

  _search: string = '';
  set search(search: string) {
    this._search = search;
    this.searchItems = this.itemSearch.transform(this.items, search);
  }
  get search(): string { return this._search; }

  constructor(private mdDialog: MdDialog,
              private headerService: HeaderService,
              private permissionsService: PermissionsService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.headerService.title = 'Inventory';

    this.itemsService.getItems()
        .subscribe(items=> this.items = items);

    this.permissionsService.canImportItems()
        .subscribe(canImportItems => this.canImportItems = canImportItems);

    this.itemsService.getItemsByCategory()
        .subscribe(categoryGroupCollection => {
          this.categories = Object.keys(categoryGroupCollection);
        })
  }

  ngOnDestroy() {
    this.itemsService.clearSelected();
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
    return this.itemsService.isSelected(item.$key);
  }

  setSelected(item: Item, checked: boolean) {
    this.itemsService.setSelected(item.$key, checked);
  }

  hasAllSelectedItems(): boolean {
    return this.searchItems.every(item => {
      return this.itemsService.isSelected(item.$key);
    })
  }

  toggleGroupSelection(select: boolean) {
    this.searchItems.forEach(item => {
      this.itemsService.setSelected(item.$key, select);
    })
  }
}
