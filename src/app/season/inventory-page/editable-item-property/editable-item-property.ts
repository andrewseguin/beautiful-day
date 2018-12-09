import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {Item, ItemsDao} from 'app/season/dao';
import {MatSelect} from '@angular/material';

@Component({
  selector: 'editable-item-property',
  templateUrl: './editable-item-property.html',
  styleUrls: ['./editable-item-property.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(keydown.Enter)': 'save()'
  }
})
export class EditableItemProperty {
  @Input() property: string;
  @Input() item: Item;
  @Input() alignEnd: boolean;

  @Output() propertyChanged = new EventEmitter<Item>();

  @ViewChild('textarea') textarea: ElementRef;
  @ViewChild(MatSelect) select: MatSelect;

  private formControl = new FormControl();

  private _destroyed = new Subject();

  formType: 'textarea' | 'select' = 'select';

  selectOptions: {value: any, label: string}[] = [];

  ngOnChanges() {
    let value;

    switch (this.property) {
      case 'categories':
        value = this.item.categories.join(', ');
        break;
      case 'hidden':
        this.selectOptions = [
          {value: false, label: ''},
          {value: true, label: 'Hidden'}
        ];
        value = !!this.item.hidden;
        break;
      case 'approved':
        this.selectOptions = [
          {value: false, label: ''},
          {value: true, label: 'Approved'}
        ];
        value = !!this.item.isApproved;
        break;
      default:
        value = this.item[this.property];
    }

    this.formControl.setValue(value, {emitEvent: false});
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.textarea) {
        this.textarea.nativeElement.focus();
        this.textarea.nativeElement.select();
      }

      if (this.select) {
        this.select.open();
      }
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  save() {
    if (!this.formControl.dirty) {
      this.propertyChanged.emit({});
    }

    const value = this.formControl.value;
    const update: Item = {};

    switch (this.property) {
      case 'categories':
        update.categories = value.split(',').map(v => v.trim());
        break;
      case 'hidden':
        update.hidden = value;
      case 'approved':
        update.isApproved = value;
      default:
        update[this.property] = value;
    }

    this.propertyChanged.emit(update);
  }
}
