import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'edit-approval-status-dialog',
  templateUrl: 'edit-approval-status.html',
  styleUrls: ['edit-approval-status.scss']
})
export class EditApprovalStatusDialogComponent {
  requestIds: Set<string>;
  isApproved: boolean = true;

  constructor(private dialogRef: MdDialogRef<EditApprovalStatusDialogComponent>,
              private requestsService: RequestsService) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsService.getRequest(requestId).subscribe(request => {
        this.isApproved = this.isApproved && !!request.isApproved;
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