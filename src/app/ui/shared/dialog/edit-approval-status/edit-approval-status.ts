import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {RequestsService} from '../../../../service/requests.service';

@Component({
  selector: 'edit-approval-status-dialog',
  templateUrl: 'edit-approval-status.html',
  styleUrls: ['edit-approval-status.scss']
})
export class EditApprovalStatusDialogComponent {
  requestIds: string[];
  isApproved = true;

  constructor(private dialogRef: MatDialogRef<EditApprovalStatusDialogComponent>,
              private requestsService: RequestsService) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsService.get(requestId).subscribe(request => {
        this.isApproved = this.isApproved && request.isApproved;
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.requestIds.forEach(requestId => {
      this.requestsService.update(requestId, {isApproved: this.isApproved});
    });

    this.close();
  }
}
