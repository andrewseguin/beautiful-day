import { Component, OnInit } from '@angular/core';
import {ItemsService} from "../../service/items.service";
import {FirebaseListObservable} from "angularfire2";
import {Item} from '../../model/item';
import {MdDialog} from '@angular/material';
import {EditItemComponent} from '../dialog/edit-item/edit-item.component';
import {HeaderService} from '../../service/header.service';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  items: FirebaseListObservable<any[]>;
  categories: any[] = [];
  categorizedItems: Map<string, Item[]> = new Map();
  viewingCategory: string;

  constructor(private mdDialog: MdDialog,
              private headerService: HeaderService,
              private itemsService: ItemsService) { }

  ngOnInit() {
    this.headerService.title = 'Inventory';

    this.itemsService.getItems().subscribe((items: Item[])=> {
      this.categorizedItems = new Map();

      items.forEach((item: Item) => {
        const category = item.category;
        if (!this.categorizedItems.has(category)) {
          this.categorizedItems.set(category, []);
        }
        this.categorizedItems.get(category).push(item);
      });

      this.categories = [];
      this.categorizedItems.forEach((items, category) => this.categories.push(category));
    });
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
}
