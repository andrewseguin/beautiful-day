import { Component, OnInit } from '@angular/core';
import {Item} from '../../../../model/item';
import {MatDialogRef} from '@angular/material';
import {ItemsService} from '../../../../service/items.service';
import {GroupsService} from '../../../../service/groups.service';

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
  isAcquisitions: boolean;

  set item(item: Item) {
    this._item = {};
    for (const prop of Object.keys(item)) {
      this._item[prop] = item[prop];
    }
  }

  constructor(private dialogRef: MatDialogRef<EditItemComponent>,
              private groupsService: GroupsService,
              private itemsService: ItemsService) {
    this.groupsService.isMember('acquisitions')
        .subscribe(isAcquisitions => this.isAcquisitions = isAcquisitions);
  }

  ngOnInit() {
    if (!this.mode) { throw Error('No mode set'); }
  }

  close() {
    this.dialogRef.close();
  }

  canSave() {
    return this._item.name !== undefined
        && this._item.cost !== undefined
        && this._item.categories !== undefined
        && this._item.url !== undefined
        && this.isValidUrl(this._item.url);
  }

  save() {
    // Title case each category
    let categories = this._item.categories.split(',');
    categories = categories.map(category => this.toTitleCase(category).trim());
    const titleCasedCategories = categories.join(';');

    const persistingItem: Item = {
      name: this.toTitleCase(this._item.name),
      type: this.toTitleCase(this._item.type || ''),
      cost: this._item.cost,
      categories: titleCasedCategories,
      url: this._item.url,
      quantityOwned: this._item.quantityOwned || ''
    };

    if (this.mode == 'edit') {
      this.itemsService.update(this._item.$key, persistingItem);
    } else if (this.mode == 'new') {
      this.itemsService.add(persistingItem);
    }

    this.close();
  }

  gotoUrl() {
    window.open(this._item.url);
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

  isValidUrl(url: string) {
    // Taken from http://stackoverflow.com/questions/8667070
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
  }
}

