import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Selection} from 'app/season/services';
import {ItemsDao} from 'app/season/dao';

@Component({
  templateUrl: 'edit-item-name.html',
  styleUrls: ['edit-item-name.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemName {
  itemIds: string[];
  name = '';

  constructor(private dialogRef: MatDialogRef<EditItemName>,
              private selection: Selection,
              private itemsDao: ItemsDao) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsDao.update(itemId, {name: this.name});
    });
    this.close();
    this.selection.items.clear();
  }
}
