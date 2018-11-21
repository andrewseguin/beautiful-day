import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Request} from 'app/season/dao';
import {takeUntil} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';

export interface EditCostAdjustmentData {
  requests: Observable<Request[]>;
}

export interface EditCostAdjustmentResult {
  costAdjustment: number;
  costAdjustmentReason: string;
}

@Component({
  templateUrl: 'edit-cost-adjustment.html',
  styleUrls: ['edit-cost-adjustment.scss'],
  host: {
    '(keyup.Enter)': 'save()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCostAdjustment implements OnInit {
  costAdjustment = new FormControl();
  costAdjustmentReason = new FormControl('');

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditCostAdjustment>,
              @Inject(MAT_DIALOG_DATA) public data: EditCostAdjustmentData) {}

  ngOnInit() {
    this.data.requests.pipe(takeUntil(this.destroyed))
        .subscribe(requests => {
          this.setValue(requests, this.costAdjustment, 'costAdjustment');
          this.setValue(requests, this.costAdjustmentReason, 'costAdjustmentReason');
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    this.dialogRef.close({
      costAdjustment: this.costAdjustment.value,
      costAdjustmentReason: this.costAdjustmentReason.value.trim(),
    });
  }

  private setValue(
      requests: Request[], formControl: FormControl, property: string) {
    const firstValue = requests[0][property];
    if (requests.every(r => r[property] === firstValue)) {
      formControl.setValue(firstValue);
    }
  }
}
