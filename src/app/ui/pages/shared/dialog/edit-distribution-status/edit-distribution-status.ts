import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Request} from 'app/model/request';
import {RequestsDao} from 'app/service/dao';

@Component({
  selector: 'edit-distribution-status-dialog',
  templateUrl: 'edit-distribution-status.html',
  styleUrls: ['edit-distribution-status.scss']
})
export class EditDistributionStatusDialogComponent {
  requestIds: string[];
  isDistributed = true;
  distributionDate = new Date();

  constructor(private dialogRef: MatDialogRef<EditDistributionStatusDialogComponent>,
              private requestsDao: RequestsDao) {}

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      const update: Request = {
        isDistributed: this.isDistributed,
        distributionDate: this.isDistributed ? this.distributionDate.getTime() : 0
      };

      this.requestsDao.update(requestId, update);
    });

    this.close();
  }
}
