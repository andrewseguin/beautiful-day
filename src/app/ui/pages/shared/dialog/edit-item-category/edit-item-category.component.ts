import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Selection} from 'app/service';
import {ItemsDao} from 'app/service/dao';

@Component({
  selector: 'app-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrls: ['./edit-item-category.component.scss']
})
export class EditItemCategoryComponent {
  itemIds: string[];
  category = '';

  constructor(private dialogRef: MatDialogRef<EditItemCategoryComponent>,
              private selection: Selection,
              private itemsDao: ItemsDao) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsDao.update(itemId, {categories: this.category});
    });
    this.close();
    this.selection.items.clear();
  }
}
