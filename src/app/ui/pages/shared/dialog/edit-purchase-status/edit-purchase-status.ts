import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {RequestsDao} from 'app/service/dao';

@Component({
  selector: 'edit-purchase-status-dialog',
  templateUrl: 'edit-purchase-status.html',
  styleUrls: ['edit-purchase-status.scss']
})
export class EditPurchaseStatusDialogComponent {
  requestIds: string[];
  isPurchased = true;

  constructor(private dialogRef: MatDialogRef<EditPurchaseStatusDialogComponent>,
              private requestsDao: RequestsDao) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsDao.get(requestId).subscribe(request => {
        this.isPurchased = this.isPurchased && request.isPurchased;
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestsDao.update(requestId, {isPurchased: this.isPurchased});
    });

    this.close();
  }
}
