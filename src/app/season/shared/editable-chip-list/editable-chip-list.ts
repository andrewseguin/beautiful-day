import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';

@Component({
  selector: 'editable-chip-list',
  styleUrls: ['editable-chip-list.scss'],
  templateUrl: 'editable-chip-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableChipList {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  @Input() label: string;

  @Input()
  set values(v: string[]) { this._values = (v || []).slice(); }
  get values(): string[] { return this._values; }
  _values: string[] = [];

  @Output() change = new EventEmitter<string[]>();

  @Input() transform = v => v;

  @Input() placeholder = '';

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.values.push(this.transform(value));
    }

    if (event.input) {
      event.input.value = '';
    }

    this.change.emit(this.values);
  }

  remove(email: string) {
    const index = this.values.indexOf(email);
    if (index >= 0) {
      this.values.splice(index, 1);
    }

    this.change.emit(this.values);
  }
}
