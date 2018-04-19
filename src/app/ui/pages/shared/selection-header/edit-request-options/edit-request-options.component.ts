import {Component} from '@angular/core';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {RequestsService} from 'app/service/requests.service';
import {EditDropoffComponent} from 'app/ui/pages/shared/dialog/edit-dropoff/edit-dropoff.component';
import {EditTagsComponent} from 'app/ui/pages/shared/dialog/edit-tags/edit-tags.component';
import {
  DeleteRequestsComponent
} from 'app/ui/pages/shared/dialog/delete-requests/delete-requests.component';
import {PromptDialogComponent} from 'app/ui/pages/shared/dialog/prompt-dialog/prompt-dialog.component';
import {
  EditPurchaseStatusDialogComponent
} from 'app/ui/pages/shared/dialog/edit-purchase-status/edit-purchase-status';
import {
  EditApprovalStatusDialogComponent
} from 'app/ui/pages/shared/dialog/edit-approval-status/edit-approval-status';
import {EditItemComponent} from 'app/ui/pages/shared/dialog/edit-item/edit-item.component';
import {ItemsService} from 'app/service/items.service';
import {PermissionsService} from 'app/service/permissions.service';
import {mergeMap} from 'rxjs/operators';
import {EditDistributionStatusDialogComponent} from "app/ui/pages/shared/dialog/edit-distribution-status/edit-distribution-status";

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
    this.requestsService.get(requestId).pipe(
      mergeMap(request => this.itemsService.get(request.item)))
      .subscribe(item => dialogRef.componentInstance.item = item);
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

  editDistributionStatus() {
    const dialogRef = this.mdDialog.open(EditDistributionStatusDialogComponent);
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
