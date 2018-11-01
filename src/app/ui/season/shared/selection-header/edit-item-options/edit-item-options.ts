import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditItemName} from 'app/ui/season/shared/dialog/edit-item-name/edit-item-name';
import {EditItemCategory} from 'app/ui/season/shared/dialog/edit-item-category/edit-item-category';
import {EditItem} from 'app/ui/season/shared/dialog/edit-item/edit-item';
import {Selection} from 'app/ui/season/services';
import {ItemsDao} from 'app/ui/season/dao';

@Component({
  selector: 'edit-item-options',
  templateUrl: 'edit-item-options.html',
  styleUrls: ['edit-item-options.scss']
})
export class EditItemOptions {

  constructor(private itemsDao: ItemsDao,
              private selection: Selection,
              private mdDialog: MatDialog) {}

  editName() {
    const dialogRef = this.mdDialog.open(EditItemName);
    dialogRef.componentInstance.itemIds = this.selection.items.selected;
  }

  editCategory() {
    const dialogRef = this.mdDialog.open(EditItemCategory);
    dialogRef.componentInstance.itemIds = this.selection.items.selected;
  }

  editItem() {
    const itemId = this.selection.items.selected.values().next().value;
    const dialogRef = this.mdDialog.open(EditItem);
    dialogRef.componentInstance.mode = 'edit';

    this.itemsDao.get(itemId).subscribe(item => {
      dialogRef.componentInstance.item = item;
    });
  }

  isMultiSelect() {
    return this.selection.items.selected.length > 1;
  }

  deleteItem() {
    this.selection.items.selected.forEach(item => {
      this.itemsDao.remove(item);
    });
    this.selection.items.clear();
  }
}
