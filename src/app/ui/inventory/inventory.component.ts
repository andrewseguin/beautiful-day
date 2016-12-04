import { Component, OnInit } from '@angular/core';
import {ItemsService} from "../../service/items.service";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {CategoriesService} from "../../service/categories.service";
import {Category} from "../../model/category";

@Component({
  selector: 'inventory',
  templateUrl: 'inventory.component.html',
  styleUrls: ['inventory.component.css']
})
export class InventoryComponent implements OnInit {
  items: FirebaseListObservable<any[]>;

  constructor(private itemsService: ItemsService,
              private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.items = this.itemsService.getItems();
  }

  getCategory(key: string): FirebaseObjectObservable<Category> {
    return this.categoriesService.getCategory(key);
  }
}
