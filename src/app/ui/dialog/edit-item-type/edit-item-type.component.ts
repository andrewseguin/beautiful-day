import {Component} from '@angular/core';
import {ItemsService} from '../../../service/items.service';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-edit-item-type',
  templateUrl: './edit-item-type.component.html',
  styleUrls: ['./edit-item-type.component.scss']
})
export class EditItemTypeComponent {
  itemIds: Set<string>;
  type: string = '';

  constructor(private dialogRef: MdDialogRef<EditItemTypeComponent>,
              private itemsService: ItemsService) { }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.itemIds.forEach(itemId => {
      this.itemsService.getItem(itemId).update({type: this.type});
    });
    this.close();
    this.itemsService.clearSelected();
  }
}
