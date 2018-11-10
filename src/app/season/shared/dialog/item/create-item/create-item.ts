import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Item} from 'app/season/dao';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

export interface CreateItemData {
  category: string;
  categories: string[];
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

    this.categories = data.categories.sort();
  }

  save() {
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

  getUrlErrorMessage() {
    const url = this.formGroup.get('url');
    return url.hasError('required') ? 'You must enter a URL' :
        url.hasError('pattern') ? 'Not a valid URL' : '';
  }
}
