import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Selection} from 'app/season/services';
import {ItemsDao} from 'app/season/dao';

@Component({
  templateUrl: 'edit-item-category.html',
  styleUrls: ['edit-item-category.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemCategory {
  itemIds: string[];
  category = '';

  constructor(private dialogRef: MatDialogRef<EditItemCategory>,
              private selection: Selection,
              private itemsDao: ItemsDao) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsDao.update(itemId, {categories: [this.category]});
    });
    this.close();
    this.selection.items.clear();
  }
}
