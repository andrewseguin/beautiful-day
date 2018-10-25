import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Event} from 'app/model';

@Component({
  styleUrls: ['event-edit.scss'],
  templateUrl: 'event-edit.html',
  host: {
    '(keyup.Enter)': 'onEnter()'
  }
})
export class EventEdit {
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<EventEdit, Event>,
              @Inject(MAT_DIALOG_DATA) public data: Event) {
    // Date taken in as a date string, converted to date for the calendar
    const dateObj = data['date'] ? new Date(data['date']) : null;
    this.formGroup = new FormGroup({
      date: new FormControl(dateObj, Validators.required),
      info: new FormControl(data['info'], Validators.required),
      time: new FormControl(data['time']),
    });
  }

  save() {
    this.dialogRef.close({
      date: (this.formGroup.get('date').value as Date).toISOString(),
      info: this.formGroup.get('info').value,
      time: this.formGroup.get('time').value,
    });
  }

  onEnter() {
    if (this.formGroup.valid) {
      this.save();
    }
  }
}
