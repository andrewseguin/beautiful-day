import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {RequestsService} from '../../../../service/requests.service';

@Component({
  selector: 'edit-purchase-status-dialog',
  templateUrl: 'edit-purchase-status.html',
  styleUrls: ['edit-purchase-status.scss']
})
export class EditPurchaseStatusDialogComponent {
  requestIds: Set<string>;
  isPurchased = true;

  constructor(private dialogRef: MatDialogRef<EditPurchaseStatusDialogComponent>,
              private requestsService: RequestsService) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsService.getRequest(requestId).subscribe(request => {
        this.isPurchased = this.isPurchased && !!request.isPurchased;
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestsService.update(requestId, {isPurchased: this.isPurchased});
    });

    this.close();
  }
}
