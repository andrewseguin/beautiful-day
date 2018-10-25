import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {Item} from 'app/model/item';

export type EditableItemCellAction = 'save' | 'cancel' | 'edit';

@Component({
  selector: 'editable-item-cell-value',
  templateUrl: './editable-item-cell-value.component.html',
  styleUrls: ['./editable-item-cell-value.component.scss']
})
export class EditableItemCellValueComponent {
  @Input()
  set item (item: Item) {
    this.cachedMultiValue = '';
    this._item = item;
  }
  get item(): Item { return this._item; }
  _item: Item;

  @Input() property: string;
  @Input() editing: boolean;
  @Input() type: 'text' | 'link' | 'currency' | 'multi'= 'text';
  @Input() align: 'before' | 'after' = 'before';
  @Output() action = new EventEmitter<EditableItemCellAction>();

  cachedMultiValue: string;

  constructor(private elementRef: ElementRef) {}

  onKeyup(e: KeyboardEvent, index?: number) {
    this.item[this.property] = this.getPropertyValue(e, index);

    switch (e.keyCode) {
      case 13: this.action.next('save'); break;
      case 27: this.action.next('cancel'); break;
    }
  }

  getSplitValue() {
    if (!this.cachedMultiValue) {
      this.cachedMultiValue = this.item[this.property].split(',');
    }

    return this.cachedMultiValue;
  }

  private getPropertyValue(e: KeyboardEvent, index?: number) {
    if (this.type === 'multi') {
      const values = this.item[this.property].split(',');
      values[index] = (<HTMLInputElement>e.target).value;
      return values.join(',');
    } else {
      return (<HTMLInputElement>e.target).value;
    }
  }

  edit() {
    this.action.next('edit');
    window.setTimeout(() => {
      this.elementRef.nativeElement.querySelector('input').focus();
    }, 150);
  }
}
