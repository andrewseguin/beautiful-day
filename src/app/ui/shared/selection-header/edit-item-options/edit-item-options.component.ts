import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MdDialog, MdSnackBar} from '@angular/material';
import {EditItemComponent} from '../../../shared/dialog/edit-item/edit-item.component';
import {EditItemCategoryComponent} from '../../../shared/dialog/edit-item-category/edit-item-category.component';
import {EditItemNameComponent} from '../../../shared/dialog/edit-item-name/edit-item-name.component';

@Component({
  selector: 'edit-item-options',
  templateUrl: './edit-item-options.component.html',
  styleUrls: ['./edit-item-options.component.scss']
})
export class EditItemOptionsComponent {

  constructor(private itemsService: ItemsService,
              private mdDialog: MdDialog,
              private snackBar: MdSnackBar) { }

  editName() {
    const dialogRef = this.mdDialog.open(EditItemNameComponent);
    dialogRef.componentInstance.itemIds = this.itemsService.getSelectedItems();
  }

  editCategory() {
    const dialogRef = this.mdDialog.open(EditItemCategoryComponent);
    dialogRef.componentInstance.itemIds = this.itemsService.getSelectedItems();
  }

  editItem() {
    const itemId = this.itemsService.getSelectedItems().values().next().value;
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'edit';

    this.itemsService.getItem(itemId).subscribe(item => {
      dialogRef.componentInstance.item = item;
    });
  }

  isMultiSelect() {
    return this.itemsService.getSelectedItems().size > 1;
  }

  deleteItem() {
    this.itemsService.getSelectedItems().forEach(item => {
      this.itemsService.getItem(item).remove();
    });
    this.itemsService.clearSelected();
  }
}