import {Component, OnInit} from '@angular/core';
import {Item} from 'app/model/item';
import {MatDialogRef} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';
import {ItemsDao} from 'app/service/dao';
import {getItemsByCategory} from 'app/utility/items-categorize';

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
  categories: string[];

  set item(item: Item) {
    this._item = {};
    for (const prop of Object.keys(item)) {
      this._item[prop] = item[prop];
    }
  }

  constructor(private dialogRef: MatDialogRef<EditItemComponent>,
              private permissionsService: PermissionsService,
              private afAuth: AngularFireAuth,
              private itemsDao: ItemsDao) {
    this.permissionsService.permissions
        .subscribe(p => this.isAcquisitions = p.has('acquisitions'));

    this.itemsDao.list.subscribe(items => {
      const itemsByCategory = getItemsByCategory(items);
      this.categories = Object.keys(itemsByCategory.subcategories);
    });
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
    categories = categories.map(category => category.trim());
    const titleCasedCategories = categories.join(',');

    const persistingItem: Item = {
      name: this._item.name.trim(),
      cost: this._item.cost,
      categories: titleCasedCategories,
      url: this._item.url,
      quantityOwned: this._item.quantityOwned || ''
    };

    if (this.mode == 'edit') {
      this.itemsDao.update(this._item.id, persistingItem);
    } else if (this.mode == 'new') {
      this.afAuth.authState.pipe(take(1)).subscribe(user => {
        persistingItem.dateAdded = new Date().getTime();
        persistingItem.addedBy = user.email;
        this.itemsDao.add(persistingItem);
      });
    }

    this.close();
  }

  gotoUrl() {
    window.open(this._item.url);
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

