import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Item} from 'app/season/dao';

export interface CreateItemData {
  category: string;
}

@Component({
  styleUrls: ['create-item.scss'],
  templateUrl: 'create-item.html',
  host: {
    '(keyup.Enter)': 'onEnter()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItem {
  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateItem>,
              @Inject(MAT_DIALOG_DATA) public data: CreateItemData) {
    if (data && data.category) {
      this.formGroup.get('category').setValue(data.category);
      this.formGroup.get('category').disable();
    }
  }

  save() {
    // Remove disabled flag so that it shows up in value
    this.formGroup.get('category').enable();

    const newItem: Item = {
      name: this.formGroup.value.name,
      categories: [this.formGroup.value.category],
      cost: this.formGroup.value.cost,
      url: this.formGroup.value.url,
    };

    this.dialogRef.close(newItem);
  }

  onEnter() {
    if (this.formGroup.valid) {
      this.save();
    }
  }
}
