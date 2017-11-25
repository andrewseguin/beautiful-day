import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Item} from '../../../../model/item';

export type EditableItemCellAction = 'save' | 'cancel' | 'edit';

@Component({
  selector: 'editable-item-cell-value',
  templateUrl: './editable-item-cell-value.component.html',
  styleUrls: ['./editable-item-cell-value.component.scss']
})
export class EditableItemCellValueComponent {
  @Input() item: Item;
  @Input() property: string;
  @Input() editing: boolean;
  @Input() type: 'text' | 'link' | 'currency' = 'text';
  @Input() align: 'before' | 'after' = 'before';
  @Output() action = new EventEmitter<EditableItemCellAction>();

  constructor(private elementRef: ElementRef) {}

  onKeyup(e: KeyboardEvent) {
    this.item[this.property] = (<HTMLInputElement>e.target).value;

    switch (e.keyCode) {
      case 13: this.action.next('save'); break;
      case 27: this.action.next('cancel'); break;
    }
  }

  edit() {
    this.action.next('edit');
    window.setTimeout(() => {
      this.elementRef.nativeElement.querySelector('input').focus();
    }, 150);
  }
}
