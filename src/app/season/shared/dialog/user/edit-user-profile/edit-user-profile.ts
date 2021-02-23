import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {User} from 'app/service/users-dao';
import {FormControl, FormGroup} from '@angular/forms';

export interface EditUserProfileData {
  name: string;
  phone: string;
}

export interface EditUserProfileResult {
  name: string;
  phone: string;
}

@Component({
  templateUrl: 'edit-user-profile.html',
  styleUrls: ['edit-user-profile.scss'],
  host: {
    '(keyup.Enter)': 'save()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserProfile {
  user: User;

  formGroup = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl('')
  });

  constructor(private dialogRef: MatDialogRef<EditUserProfile>,
              @Inject(MAT_DIALOG_DATA) public data: EditUserProfileData) {
    if (data && data.name) {
      this.formGroup.get('name').setValue(data.name);
    }

    if (data && data.phone) {
      this.formGroup.get('phone').setValue(data.phone);
    }
  }

  save() {
    this.dialogRef.close({
      name: this.formGroup.get('name').value,
      phone: this.formGroup.get('phone').value
    });
  }
}
