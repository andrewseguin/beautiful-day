import {Component} from '@angular/core';
import {ItemsService} from '../../../../service/items.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-name.component.html',
  styleUrls: ['./edit-item-name.component.scss']
})
export class EditItemNameComponent {
  itemIds: Set<string>;
  name: string = '';

  constructor(private dialogRef: MdDialogRef<EditItemNameComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsService.getItem(itemId).update({name: this.name});
    });
    this.close();
    this.itemsService.clearSelected();
  }
}
