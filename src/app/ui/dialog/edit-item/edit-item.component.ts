import { Component, OnInit } from '@angular/core';
import {Item} from '../../../model/item';
import {MdDialogRef} from '@angular/material';
import {ItemsService} from '../../../service/items.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  _item: Item;
  mode: 'New' | 'Edit' | 'View';

  set item(item: Item) {
    this._item = {};
    for (const prop of Object.keys(item)) {
      this._item[prop] = item[prop]
    }

    this.mode = 'Edit';
  }

  constructor(private dialogRef: MdDialogRef<EditItemComponent>,
              private itemsService: ItemsService) { }

  ngOnInit() {
    console.log(this._item);
  }

  close() {
    this.dialogRef.close();
  }

  canSave() {
    return this._item.name != undefined
        && this._item.cost != undefined
        && this._item.category != undefined
        && this._item.url != undefined

  }

  save() {
    this.itemsService.getItem(this._item.$key).update({
      name: this._item.name,
      type: this._item.type || '',
      cost: this._item.cost,
      category: this._item.category,
      url: this._item.url,
    });
    this.close();
  }

}
