import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Permissions} from 'app/season/services/permissions';
import {ItemsDao, RequestsDao} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {RequestDialog} from 'app/season/shared/dialog/request/request-dialog';

@Component({
  selector: 'edit-request-options',
  templateUrl: 'edit-request-options.html',
  styleUrls: ['edit-request-options.scss']
})
export class EditRequestOptions {
  constructor(private requestsDao: RequestsDao,
              private itemsDao: ItemsDao,
              private mdDialog: MatDialog,
              private selection: Selection,
              private requestDialog: RequestDialog,
              public permissions: Permissions) {}

  getSelectedRequestsCount() {
    return this.selection.requests.selected.length;
  }

  deleteRequests() {
    this.requestDialog.deleteRequests(this.selection.requests.selected);
  }

  editNote() {
    this.requestDialog.editNote(this.selection.requests.selected);
  }

  editDropoff() {
    this.requestDialog.editDropoff(this.selection.requests.selected);
  }

  editTags() {
    this.requestDialog.editTags(this.selection.requests.selected);
  }

  editPurchaser() {
    this.requestDialog.editPurchaser(this.selection.requests.selected);
  }

  editApprovalStatus() {
    this.requestDialog.editStatus(this.selection.requests.selected);
  }

  editAllocation() {
    this.requestDialog.editAllocation(this.selection.requests.selected);
  }
}
