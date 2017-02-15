import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";

@Component({
  selector: 'edit-request-status-dialog',
  templateUrl: 'edit-request-status.html',
  styleUrls: ['edit-request-status.scss']
})
export class EditRequestStatusDialogComponent {
  requestIds: Set<string>;
  isApproved: boolean = true;
  isPurchased: boolean = true;

  constructor(private dialogRef: MdDialogRef<EditRequestStatusDialogComponent>,
              private requestsService: RequestsService) {}

  ngOnInit() {
    this.requestIds.forEach(requestId => {
      this.requestsService.getRequest(requestId).first().subscribe(request => {
        this.isApproved = this.isApproved && request.isApproved;
        this.isPurchased = this.isPurchased && request.isPurchased;
      });
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.close();
  }
}
