import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {RequestsDao} from 'app/ui/season/dao';

@Component({
  selector: 'edit-approval-status-dialog',
  templateUrl: 'edit-approval-status.html',
  styleUrls: ['edit-approval-status.scss']
})
export class EditApprovalStatusDialogComponent {
  requestIds: string[];
  isApproved = true;

  constructor(private dialogRef: MatDialogRef<EditApprovalStatusDialogComponent>,
              private requestsDao: RequestsDao) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsDao.get(requestId).subscribe(request => {
        this.isApproved = this.isApproved && request.isApproved;
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestsDao.update(requestId, {isApproved: this.isApproved});
    });

    this.close();
  }
}
