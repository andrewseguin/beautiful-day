import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrls: ['./edit-item-category.component.scss']
})
export class EditItemCategoryComponent {
  itemIds: Set<string>;
  category: string = '';

  constructor(private dialogRef: MatDialogRef<EditItemCategoryComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsService.getItem(itemId).update({categories: this.category});
    });
    this.close();
    this.itemsService.clearSelected();
  }
}
