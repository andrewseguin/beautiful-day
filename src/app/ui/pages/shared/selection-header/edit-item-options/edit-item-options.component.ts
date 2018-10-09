import {Component} from '@angular/core';
import {ItemsService} from 'app/service/items.service';
import {MatDialog} from '@angular/material';
import {EditItemNameComponent} from 'app/ui/pages/shared/dialog/edit-item-name/edit-item-name.component';
import {
  EditItemCategoryComponent
} from 'app/ui/pages/shared/dialog/edit-item-category/edit-item-category.component';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';

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
    dialogRef.componentInstance.itemIds = this.itemsService.selection.selected;
  }

  editCategory() {
    const dialogRef = this.mdDialog.open(EditItemCategoryComponent);
    dialogRef.componentInstance.itemIds = this.itemsService.selection.selected;
  }

  editItem() {
    const itemId = this.itemsService.selection.selected.values().next().value;
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = 'edit';

    this.itemsService.get(itemId).subscribe(item => {
      dialogRef.componentInstance.item = item;
    });
  }

  isMultiSelect() {
    return this.itemsService.selection.selected.length > 1;
  }

  deleteItem() {
    this.itemsService.selection.selected.forEach(item => {
      this.itemsService.remove(item);
    });
    this.itemsService.selection.clear();
  }
}
