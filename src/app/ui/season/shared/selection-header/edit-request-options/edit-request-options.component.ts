import {Component} from '@angular/core';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {EditDropoffComponent} from 'app/ui/season/shared/dialog/edit-dropoff/edit-dropoff.component';
import {EditTagsComponent} from 'app/ui/season/shared/dialog/edit-tags/edit-tags.component';
import {DeleteRequestsComponent} from 'app/ui/season/shared/dialog/delete-requests/delete-requests.component';
import {PromptDialogComponent} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog.component';
import {EditPurchaseStatusDialogComponent} from 'app/ui/season/shared/dialog/edit-purchase-status/edit-purchase-status';
import {EditApprovalStatusDialogComponent} from 'app/ui/season/shared/dialog/edit-approval-status/edit-approval-status';
import {EditItemComponent} from 'app/ui/season/shared/dialog/edit-item/edit-item.component';
import {PermissionsService} from 'app/ui/season/services/permissions.service';
import {mergeMap} from 'rxjs/operators';
import {EditDistributionStatusDialogComponent} from 'app/ui/season/shared/dialog/edit-distribution-status/edit-distribution-status';
import {ItemsDao, RequestsDao} from 'app/ui/season/dao';
import {Selection} from 'app/ui/season/services';
import {RequestDialog} from 'app/ui/season/shared/dialog/request.dialog';

@Component({
  selector: 'edit-request-options',
  templateUrl: './edit-request-options.component.html',
  styleUrls: ['./edit-request-options.component.scss']
})
export class EditRequestOptionsComponent {
  isAcquistionsUser: boolean;
  isApproversUser: boolean;

  constructor(private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              private mdDialog: MatDialog,
              private selection: Selection,
              private requestDialog: RequestDialog,
              private permissionsService: PermissionsService,
              private snackBar: MatSnackBar) {
    this.permissionsService.permissions.subscribe(p => {
      this.isAcquistionsUser = p.has('acquisitions');
      this.isApproversUser = p.has('approvers');
    });
  }

  getSelectedRequestsCount() {
    return this.selection.requests.selected.length;
  }

  viewSelectedRequestItem() {
    const dialogRef = this.mdDialog.open(EditItemComponent);
    dialogRef.componentInstance.mode = this.isAcquistionsUser ? 'edit' : 'view';

    const requestId = this.selection.requests.selected[0];
    this.requestsDao.get(requestId).pipe(
      mergeMap(request => this.itemsDao.get(request.item)))
      .subscribe(item => dialogRef.componentInstance.item = item);
  }

  deleteRequests() {
    const dialogRef = this.mdDialog.open(DeleteRequestsComponent);
    dialogRef.componentInstance.requests =
      this.selection.requests.selected;

    dialogRef.componentInstance.onDelete().subscribe(() => {
      this.selection.requests.selected.forEach(id => {
        this.requestsDao.remove(id);
      });

      const message = `Removed ${this.selection.requests.selected.length} requests`;
      const config: MatSnackBarConfig = {duration: 3000};
      this.snackBar.open(message, null, config);

      this.selection.requests.clear();
    });
  }

  editNote() {
    this.requestDialog.editNote(this.selection.requests.selected);
  }

  editDropoff() {
    const dialogRef = this.mdDialog.open(EditDropoffComponent);
    dialogRef.componentInstance.requestIds =
      this.selection.requests.selected;

    const selectedRequests = this.selection.requests.selected;
    dialogRef.componentInstance.requestIds = selectedRequests;
    const firstRequest = selectedRequests[0];
    this.requestsDao.get(firstRequest).subscribe(request => {
      if (selectedRequests.length === 1) {
        dialogRef.componentInstance.selectedDropoffLocation = request.dropoff;
        dialogRef.componentInstance.setDateFromRequest(request.date);
      }
      dialogRef.componentInstance.project = request.project;
    });
  }

  editTags() {
    const dialogRef = this.mdDialog.open(EditTagsComponent);
    dialogRef.componentInstance.requestIds = this.selection.requests.selected;
  }

  editPurchaser() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Set Purchaser';

    const selectedRequests = this.selection.requests.selected;
    const firstRequest = selectedRequests[0];
    this.requestsDao.get(firstRequest).subscribe(request => {
      if (selectedRequests.length == 1) {
        dialogRef.componentInstance.input = request.purchaser;
      }
    });

    dialogRef.componentInstance.onSave().subscribe(text => {
      selectedRequests.forEach(requestId => {
        this.requestsDao.update(requestId, {purchaser: <string>text});
      });
      this.selection.requests.clear();
    });
  }

  editApprovalStatus() {
    const dialogRef = this.mdDialog.open(EditApprovalStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.selection.requests.selected;
  }

  editPurchaseStatus() {
    const dialogRef = this.mdDialog.open(EditPurchaseStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.selection.requests.selected;
  }

  editDistributionStatus() {
    const dialogRef = this.mdDialog.open(EditDistributionStatusDialogComponent);
    dialogRef.componentInstance.requestIds = this.selection.requests.selected;
  }

  editAllocation() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Edit Allocated Stock';
    dialogRef.componentInstance.type = 'number';

    const requestId = this.selection.requests.selected[0];
    this.requestsDao.get(requestId).subscribe(request => {
      dialogRef.componentInstance.input = request.allocation;
    });

    dialogRef.componentInstance.onSave().subscribe(allocation => {
      this.requestsDao.update(requestId, {allocation: <number>allocation});
    });
  }
}
