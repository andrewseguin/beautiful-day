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
  @Input() item: string;
  @Input() alignEnd: boolean;

  @Output() propertyChanged = new EventEmitter<any>();

  @ViewChild('textarea') textarea: ElementRef;

  private formControl = new FormControl();

  private _destroyed = new Subject();

  ngOnChanges() {
    this.formControl.setValue(this.item[this.property], {emitEvent: false});
  }

  ngAfterViewInit() {
    this.textarea.nativeElement.focus();
    this.textarea.nativeElement.select();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  save() {
    if (this.formControl.dirty) {
      this.propertyChanged.emit(this.formControl.value);
    }
  }
}
