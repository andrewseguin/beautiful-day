import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ItemDialog} from 'app/season/shared/dialog/item/item-dialog';

@Component({
  selector: 'add-new-item',
  templateUrl: 'add-new-item.html',
  styleUrls: ['add-new-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewItem {
  @Input() category: string;

  constructor(public itemDialog: ItemDialog) {}
}
