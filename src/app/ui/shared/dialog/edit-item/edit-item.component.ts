import { Component, OnInit } from '@angular/core';
import {Item} from '../../../../model/item';
import {MdDialogRef} from '@angular/material';
import {ItemsService} from '../../../../service/items.service';

export type Mode = 'new' | 'edit' | 'view';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  _item: Item = {};
  disableCategory: boolean;
  mode: Mode;

  set item(item: Item) {
    this._item = {};
    for (const prop of Object.keys(item)) {
      this._item[prop] = item[prop]
    }
  }

  constructor(private dialogRef: MdDialogRef<EditItemComponent>,
              private itemsService: ItemsService) { }

  ngOnInit() {
    if (!this.mode) throw Error('No mode set');
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
    const persistingItem: Item = {
      name: this.toTitleCase(this._item.name),
      type: this.toTitleCase(this._item.type || ''),
      cost: this._item.cost,
      category: this.toTitleCase(this._item.category),
      url: this._item.url
    };

    if (this.mode == 'edit') {
      this.itemsService.getItem(this._item.$key).update(persistingItem);
    } else if (this.mode == 'new') {
      // Set the dateMove the UTC date to user's time zone
      const date = new Date();
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      persistingItem.dateAdded = new Date().getTime();

      this.itemsService.createItem(persistingItem);
    }

    this.close();
  }

  toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, word => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }

  getTitle() {
    switch (this.mode) {
      case 'new': return 'Create Item';
      case 'edit': return 'Edit Item';
      case 'view': return 'Item Details';
    }
  }
}

