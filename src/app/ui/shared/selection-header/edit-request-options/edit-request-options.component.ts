import {Component} from '@angular/core';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {RequestsService} from '../../../../service/requests.service';
import {EditDropoffComponent} from '../../dialog/edit-dropoff/edit-dropoff.component';
import {EditTagsComponent} from '../../dialog/edit-tags/edit-tags.component';
import {DeleteRequestsComponent} from '../../dialog/delete-requests/delete-requests.component';
import {PromptDialogComponent} from '../../dialog/prompt-dialog/prompt-dialog.component';
import {EditPurchaseStatusDialogComponent} from '../../dialog/edit-purchase-status/edit-purchase-status';
import {EditApprovalStatusDialogComponent} from '../../dialog/edit-approval-status/edit-approval-status';
import {EditItemComponent} from '../../dialog/edit-item/edit-item.component';
import {ItemsService} from '../../../../service/items.service';
import {PermissionsService} from '../../../../service/permissions.service';

@Component({
  selector: 'edit-request-options',
  templateUrl: './edit-request-options.component.html',
  styleUrls: ['./edit-request-options.component.scss']
})
export class EditRequestOptionsComponent {
  isAcquistionsUser: boolean;
  isApproversUser: boolean;

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService,
              private mdDialog: MatDialog,
              private permissionsService: PermissionsService,
              private snackBar: MatSnackBar) {
    this.permissionsService.permissions.subscribe(permissions => {
      this.isAcquistionsUser = permissions.acquisition;
      this.isApproversUser = permissions.approver;
    });
  }

  getSelectedRequestsCount() {
    return this.requestsService.selection.selected.length;
  }

  viewSelectedRequestItem() {
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = this.isAcquistionsUser ? 'edit' : 'view';

    const requestId = this.requestsService.selection.selected[0];
    this.requestsService.get(requestId).flatMap(request => {
      return this.itemsService.get(request.item);
    }).subscribe(item => {
      dialogRef.componentInstance.item = item;
    });
  }

  deleteRequests() {
    const dialogRef = this.mdDialog.open(DeleteRequestsComponent);
    dialogRef.componentInstance.requests =
      this.requestsService.selection.selected;

    dialogRef.componentInstance.onDelete().subscribe(() => {
      this.requestsService.selection.selected.forEach(id => {
        this.requestsService.remove(id);
      });

      const message = `Removed ${this.requestsService.selection.selected.length} requests`;
      const config: MatSnackBarConfig = {duration: 3000};
      this.snackBar.open(message, null, config);

      this.requestsService.selection.clear();
    });
  }

  editNote() {
    this.requestsService.editNote(this.requestsService.selection.selected);
  }

  editDropoff() {
    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds =
      this.requestsService.selection.selected;

    const selectedRequests = this.requestsService.selection.selected;
    dialogRef.componentInstance.requestIds = selectedRequests;
    const firstRequest = selectedRequests[0];
    this.requestsService.get(firstRequest).subscribe(request => {
      if (selectedRequests.length === 1) {
        dialogRef.componentInstance.selectedDropoffLocation = request.dropoff;
        dialogRef.componentInstance.setDateFromRequest(request.date);
      }
      dialogRef.componentInstance.project = request.project;
    });
  }

  editTags() {
    const dialogRef = this.mdDialog.open(EditTagsComponent);
    dialogRef.componentInstance.requestIds = this.requestsService.selection.selected;
  }

  editPurchaser() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Set Purchaser';

    const selectedRequests = this.requestsService.selection.selected;
    const firstRequest = selectedRequests[0];
    this.requestsService.get(firstRequest).subscribe(request => {
      if (selectedRequests.length == 1) {
        dialogRef.componentInstance.input = request.purchaser;
      }
    });

    dialogRef.componentInstance.onSave().subscribe(text => {
      selectedRequests.forEach(requestId => {
        this.requestsService.update(requestId, {purchaser: <string>text});
      });
      this.requestsService.selection.clear();
    });
  }

  editApprovalStatus() {
    const dialogRef = this.mdDialog.open(EditApprovalStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.requestsService.selection.selected;
  }

  editPurchaseStatus() {
    const dialogRef = this.mdDialog.open(EditPurchaseStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.requestsService.selection.selected;
  }

  editAllocation() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Edit Allocated Stock';
    dialogRef.componentInstance.type = 'number';

    const requestId = this.requestsService.selection.selected[0];
    this.requestsService.get(requestId).subscribe(request => {
      dialogRef.componentInstance.input = request.allocation;
    });

    dialogRef.componentInstance.onSave().subscribe(allocation => {
      this.requestsService.update(requestId, {allocation: <number>allocation});
    });
  }
}
