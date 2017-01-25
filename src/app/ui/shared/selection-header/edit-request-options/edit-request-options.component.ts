import {Component} from "@angular/core";
import {MdSnackBar, MdDialog, MdSnackBarConfig} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";
import {EditDropoffComponent} from "../../dialog/edit-dropoff/edit-dropoff.component";
import {EditTagsComponent} from "../../dialog/edit-tags/edit-tags.component";
import {DeleteRequestsComponent} from "../../dialog/delete-requests/delete-requests.component";

@Component({
  selector: 'edit-request-options',
  templateUrl: './edit-request-options.component.html',
  styleUrls: ['./edit-request-options.component.scss']
})
export class EditRequestOptionsComponent {

  constructor(private requestsService: RequestsService,
              private mdDialog: MdDialog,
              private snackBar: MdSnackBar) { }

  deleteRequests() {
    const dialogRef = this.mdDialog.open(DeleteRequestsComponent);
    dialogRef.componentInstance.requests =
      this.requestsService.getSelectedRequests();

    dialogRef.componentInstance.onDelete().subscribe(() => {
      this.requestsService.getSelectedRequests().forEach(id => {
        this.requestsService.removeRequest(id);
      });

      const message = `Removed ${this.requestsService.getSelectedRequests().size} requests`;
      const config: MdSnackBarConfig = {duration: 3000};
      this.snackBar.open(message, null, config);

      this.requestsService.clearSelected();
    });
  }

  editNote() {
    this.requestsService.editNote(this.requestsService.getSelectedRequests());
  }

  editDropoff() {
    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds =
        this.requestsService.getSelectedRequests();

    const selectedRequests = this.requestsService.getSelectedRequests();
    dialogRef.componentInstance.requestIds = selectedRequests;
    const firstRequest = selectedRequests.values().next().value;
    this.requestsService.getRequest(firstRequest).subscribe(request => {
      if (selectedRequests.size == 1) {
        dialogRef.componentInstance.selectedDropoffLocation = request.dropoff;
        dialogRef.componentInstance.setDateFromRequest(request.date);
      }
      dialogRef.componentInstance.project = request.project;
    });
  }

  editTags() {
    const dialogRef = this.mdDialog.open(EditTagsComponent);
    dialogRef.componentInstance.requestIds =
        this.requestsService.getSelectedRequests();
  }
}
