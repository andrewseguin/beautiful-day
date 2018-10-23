import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Selection} from 'app/service';
import {ItemsDao} from 'app/service/dao';

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-name.component.html',
  styleUrls: ['./edit-item-name.component.scss']
})
export class EditItemNameComponent {
  itemIds: string[];
  name = '';

  constructor(private dialogRef: MatDialogRef<EditItemNameComponent>,
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
