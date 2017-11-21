import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MatDialog} from '@angular/material';
import {EditItemComponent} from '../../dialog/edit-item/edit-item.component';
import {EditItemCategoryComponent} from '../../dialog/edit-item-category/edit-item-category.component';
import {EditItemNameComponent} from '../../dialog/edit-item-name/edit-item-name.component';
import {transformSnapshotAction} from '../../../../utility/snapshot-tranform';

@Component({
  selector: 'edit-item-options',
  templateUrl: './edit-item-options.component.html',
  styleUrls: ['./edit-item-options.component.scss']
})
export class EditItemOptionsComponent {

  constructor(private itemsService: ItemsService,
              private mdDialog: MatDialog) {}

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

    this.itemsService.getItem(itemId).snapshotChanges().map(transformSnapshotAction).subscribe(item => {
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
