import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs';
import {Request} from 'app/season/dao';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';

export interface EditStatusData {
  label: string;
  value: Observable<boolean>;
}

export interface EditStatusResult extends Request {
  value: boolean;
}

@Component({
  templateUrl: 'edit-item-status.html',
  styleUrls: ['edit-item-status.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemStatus {
  formControl = new FormControl();

  label: string;

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditItemStatus, EditStatusResult>,
              private cd: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public data: EditStatusData) {
    this.label = data.label;
    this.data.value.pipe(takeUntil(this.destroyed)).subscribe(value => {
      this.formControl.setValue(value);
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.dialogRef.close({value: this.formControl.value});
  }
}
