import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  styleUrls: ['report-edit.component.scss'],
  templateUrl: 'report-edit.component.html',
  host: {
    '(keyup.Enter)': 'onEnter()'
  }
})
export class ReportEditComponent {
  constructor(public dialogRef: MatDialogRef<ReportEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data['name']) {
      this.formGroup.get('name').setValue(data['name']);
    }

    if (data && data['group']) {
      this.formGroup.get('group').setValue(data['group']);
    }
  }

  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    group: new FormControl('')
  });

  save() {
    this.dialogRef.close({
      name: this.formGroup.get('name').value,
      group: this.formGroup.get('group').value
    });
  }

  onEnter() {
    if (this.formGroup.valid) {
      this.save();
    }
  }
}
