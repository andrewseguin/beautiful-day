import { Component, OnInit } from '@angular/core';
import {ItemsService} from "../../service/items.service";
import {FirebaseListObservable} from "angularfire2";

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  items: FirebaseListObservable<any[]>;

  constructor(private itemsService: ItemsService) { }

  ngOnInit() {
    this.items = this.itemsService.getItems();
  }
}
