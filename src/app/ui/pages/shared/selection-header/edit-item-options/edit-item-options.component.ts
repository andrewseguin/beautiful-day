import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {EditItemNameComponent} from 'app/ui/pages/shared/dialog/edit-item-name/edit-item-name.component';
import {EditItemCategoryComponent} from 'app/ui/pages/shared/dialog/edit-item-category/edit-item-category.component';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';
import {Selection} from 'app/service';
import {ItemsDao} from 'app/service/dao';

@Component({
  selector: 'edit-item-options',
  templateUrl: './edit-item-options.component.html',
  styleUrls: ['./edit-item-options.component.scss']
})
export class EditItemOptionsComponent {

  constructor(private itemsDao: ItemsDao,
              private selection: Selection,
              private mdDialog: MatDialog) {}

  editName() {
    const dialogRef = this.mdDialog.open(EditItemNameComponent);
    dialogRef.componentInstance.itemIds = this.selection.items.selected;
  }

  editCategory() {
    const dialogRef = this.mdDialog.open(EditItemCategoryComponent);
    dialogRef.componentInstance.itemIds = this.selection.items.selected;
  }

  editItem() {
    const itemId = this.selection.items.selected.values().next().value;
    const dialogRef = this.mdDialog.open(EditItemComponent);
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
