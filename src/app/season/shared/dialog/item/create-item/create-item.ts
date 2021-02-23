import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Item} from 'app/season/dao';

export interface CreateItemData {
  category: string;
  categories: string[];
  showRequest: boolean;
}

export interface CreateItemResult {
  item: Item;
  addRequest: boolean;
}

@Component({
  styleUrls: ['create-item.scss'],
  templateUrl: 'create-item.html',
  host: {
    '(keyup.Enter)': 'save(showRequest)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateItem {
  showRequest: boolean;
  forceCategory = false;
  categories: string[];

  formGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required),
    url: new FormControl('', [Validators.required, Validators.pattern('^https?.+')]),
  });

  constructor(public dialogRef: MatDialogRef<CreateItem>,
              @Inject(MAT_DIALOG_DATA) public data: CreateItemData) {
    if (data && data.category) {
      this.formGroup.get('category').setValue(data.category);
      this.formGroup.get('category').disable();
      this.forceCategory = true;
    }

    if (data && data.showRequest) {
      this.showRequest = data.showRequest;
    }

    this.categories = data.categories.sort();
  }

  save(addRequest = false) {
    if (!this.formGroup.valid) {
      return;
    }

    this.formGroup.get('category').enable();

    const item: Item = {
      name: this.formGroup.value.name,
      categories: [this.formGroup.value.category],
      cost: this.formGroup.value.cost,
      url: this.formGroup.value.url,
    };

    this.dialogRef.close({item, addRequest});
  }

  getUrlErrorMessage() {
    const url = this.formGroup.get('url');
    return url.hasError('required') ? 'You must enter a URL' :
        url.hasError('pattern') ? 'Not a valid URL' : '';
  }
}
