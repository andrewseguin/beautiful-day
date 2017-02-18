import {Component} from "@angular/core";
import {MdSnackBar, MdDialog, MdSnackBarConfig} from "@angular/material";
import {RequestsService} from "../../../../service/requests.service";
import {GroupsService} from "../../../../service/groups.service";
import {EditDropoffComponent} from "../../dialog/edit-dropoff/edit-dropoff.component";
import {EditTagsComponent} from "../../dialog/edit-tags/edit-tags.component";
import {DeleteRequestsComponent} from "../../dialog/delete-requests/delete-requests.component";
import {PromptDialogComponent} from "../../dialog/prompt-dialog/prompt-dialog.component";
import {EditPurchaseStatusDialogComponent} from "../../dialog/edit-purchase-status/edit-purchase-status";
import {EditApprovalStatusDialogComponent} from "../../dialog/edit-approval-status/edit-approval-status";
import {EditItemComponent} from "../../dialog/edit-item/edit-item.component";
import {ItemsService} from "../../../../service/items.service";

@Component({
  selector: 'edit-request-options',
  templateUrl: './edit-request-options.component.html',
  styleUrls: ['./edit-request-options.component.scss']
})
export class EditRequestOptionsComponent {
  isAcquistionsUser: boolean;

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService,
              private mdDialog: MdDialog,
              private groupsService: GroupsService,
              private snackBar: MdSnackBar) {
    this.groupsService.isAcquistionsUser()
        .subscribe(isAcquistionsUser => this.isAcquistionsUser = isAcquistionsUser);
  }

  getSelectedRequestsCount() {
    return this.requestsService.getSelectedRequests().size;
  }

  viewSelectedRequestItem() {
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = this.isAcquistionsUser ? 'edit' : 'view';

    const requestId = this.requestsService.getSelectedRequests().values().next().value;
    this.requestsService.getRequest(requestId).flatMap(request => {
      return this.itemsService.getItem(request.item);
    }).subscribe(item => {
      console.log(item)
      dialogRef.componentInstance.item = item;
    });
  }

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

  editPurchaser() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Set Purchaser';

    const selectedRequests = this.requestsService.getSelectedRequests();
    const firstRequest = selectedRequests.values().next().value;
    this.requestsService.getRequest(firstRequest).subscribe(request => {
      if (selectedRequests.size == 1) {
        dialogRef.componentInstance.input = request.purchaser;
      }
    });

    dialogRef.componentInstance.onSave().subscribe(text => {
      selectedRequests.forEach(requestId => {
        this.requestsService.update(requestId, {purchaser: text});
      });
      this.requestsService.clearSelected();
    });
  }

  editApprovalStatus() {
    const dialogRef = this.mdDialog.open(EditApprovalStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.requestsService.getSelectedRequests();
  }

  editPurchaseStatus() {
    const dialogRef = this.mdDialog.open(EditPurchaseStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.requestsService.getSelectedRequests();
  }
}
