import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Permissions} from 'app/season/services/permissions';
import {AngularFireAuth} from '@angular/fire/auth';
import {take, takeUntil} from 'rxjs/operators';
import {Item, ItemsDao} from 'app/season/dao';
import {getItemsByCategory} from 'app/utility/items-categorize';
import {Subject} from 'rxjs';

export type Mode = 'new' | 'edit' | 'view';

@Component({
  templateUrl: 'edit-item.html',
  styleUrls: ['edit-item.scss']
})
export class EditItem implements OnInit {
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

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditItem>,
              private permissions: Permissions,
              private afAuth: AngularFireAuth,
              private itemsDao: ItemsDao) {
    this.permissions.permissions
        .pipe(takeUntil(this.destroyed))
        .subscribe(p => this.isAcquisitions = p.has('acquisitions'));

    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      const itemsByCategory = getItemsByCategory(items);
      this.categories = Object.keys(itemsByCategory.subcategories);
    });
  }

  ngOnInit() {
    if (!this.mode) { throw Error('No mode set'); }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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
    const persistingItem: Item = {
      name: this._item.name.trim(),
      cost: this._item.cost,
      categories: this._item.categories.map(c => c.trim()),
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
    return url && url.indexOf('http') === 0;
  }
}

