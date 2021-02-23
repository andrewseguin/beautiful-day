import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output, ViewChild
} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'editable-chip-list',
  styleUrls: ['editable-chip-list.scss'],
  templateUrl: 'editable-chip-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableChipList {
  formControl = new FormControl();

  @Input() label: string;

  @Input()
  set values(v: string[]) { this._values = (v || []).slice(); }
  get values(): string[] { return this._values; }
  _values: string[] = [];

  @Output() listChange = new EventEmitter<string[]>();

  @Input() transform = v => v;

  @Input() placeholder = '';

  @ViewChild('chipInput', { static: true }) chipInput: ElementRef;

  private _destroyed = new Subject();

  ngOnInit() {
    this.formControl.valueChanges.pipe(
        takeUntil(this._destroyed))
        .subscribe((value: string) => {
          // Doing this manually rather than providing separator key codes
          // to the chip input since it does not handle the keypresses of comma
          // or spaces on mobile
          const lastChar = value.charAt(value.length - 1);
          if (lastChar === ',' || lastChar === ' ') {
            this.add(value.slice(0, -1));  // Remove last character
          }
        });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  add(value: string): void {
    value = (value || '').trim();
    if (!value) {
      return;
    }

    this.values.push(this.transform(value));
    this.chipInput.nativeElement.value = '';
    this.listChange.emit(this.values);
  }

  remove(email: string) {
    const index = this.values.indexOf(email);
    if (index >= 0) {
      this.values.splice(index, 1);
    }

    this.listChange.emit(this.values);
  }

  addFromTextInput(e: Event) {
    console.log(e);
  }
}
