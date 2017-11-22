import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-name.component.html',
  styleUrls: ['./edit-item-name.component.scss']
})
export class EditItemNameComponent {
  itemIds: string[];
  name = '';

  constructor(private dialogRef: MatDialogRef<EditItemNameComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsService.update(itemId, {name: this.name});
    });
    this.close();
    this.itemsService.selection.clear();
  }
}
