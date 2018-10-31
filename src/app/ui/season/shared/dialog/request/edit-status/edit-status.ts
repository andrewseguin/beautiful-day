import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable, Subject} from 'rxjs';
import {Request} from 'app/model/index';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PermissionsService} from 'app/ui/season/services/index';
import {takeUntil} from 'rxjs/operators';

export interface EditStatusData {
  requests: Observable<Request[]>;
}

export interface EditStatusResult extends Request {
  isApproved?: boolean;
  isPurchased?: boolean;
  isDistributed?: boolean;
  distributionDate?: string;
}

interface EditStatusForm {
  isApproved?: boolean;
  isPurchased?: boolean;
  isDistributed?: boolean;
  distributionDate?: string;
}

@Component({
  selector: 'edit-status',
  templateUrl: 'edit-status.html',
  styleUrls: ['edit-status.scss']
})
export class EditStatus {
  formGroup: FormGroup;

  private destroyed = new Subject();

  constructor(private dialogRef: MatDialogRef<EditStatus, EditStatusResult>,
              private permissionsService: PermissionsService,
              @Inject(MAT_DIALOG_DATA) public data: EditStatusData) {
    this.data.requests.subscribe(requests => {
      const firstDate = requests[0].distributionDate;
      const matchingDates = requests.every(r => r.distributionDate === firstDate);

      this.formGroup = new FormGroup({
        isApproved: new FormControl(requests.every(r => r.isApproved)),
        isPurchased: new FormControl(requests.every(r => r.isPurchased)),
        isDistributed: new FormControl(requests.every(r => r.isDistributed)),
        distributionDate: new FormControl(matchingDates ? firstDate : '', Validators.required),
      });
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  save() {
    const formValues = this.formGroup.value as EditStatusForm;

    const updated = new Subject();
    this.permissionsService.permissions.pipe(takeUntil(updated)).subscribe(groups => {
      if (!groups) {
        return;
      }

      updated.next();
      updated.complete();

      const result: EditStatusResult = {};
      if (groups.has('approvers')) {
        result.isApproved = formValues.isApproved;
      }

      if (groups.has('acquisitions')) {
        result.isPurchased = formValues.isPurchased;
        result.isDistributed = formValues.isDistributed;

        if (result.isDistributed) {
          result.distributionDate = new Date(formValues.distributionDate).toISOString();
        }
      }

      this.dialogRef.close(result);
    });
  }
}
