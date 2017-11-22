import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrls: ['./edit-item-category.component.scss']
})
export class EditItemCategoryComponent {
  itemIds: string[];
  category = '';

  constructor(private dialogRef: MatDialogRef<EditItemCategoryComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsService.update(itemId, {categories: this.category});
    });
    this.close();
    this.itemsService.selection.clear();
  }
}
