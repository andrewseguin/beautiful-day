import {Injectable} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {DeleteConfirmation, DeleteConfirmationData} from 'app/season/shared/dialog/delete-confirmation/delete-confirmation';
import {PromptDialog, PromptDialogResult} from 'app/season/shared/dialog/prompt-dialog/prompt-dialog';
import {EditCostAdjustment, EditCostAdjustmentResult} from 'app/season/shared/dialog/request/edit-cost-adjustment/edit-cost-adjustment';
import {EditDropoff, EditDropoffResult} from 'app/season/shared/dialog/request/edit-dropoff/edit-dropoff';
import {EditStatus, EditStatusData, EditStatusResult} from 'app/season/shared/dialog/request/edit-status/edit-status';
import {EditTags, EditTagsResult} from 'app/season/shared/dialog/request/edit-tags/edit-tags';
import {getMergedObjectValue} from 'app/season/utility/merged-obj-value';
import {combineLatest, of} from 'rxjs';
import {map, mergeMap, take} from 'rxjs/operators';
import {EditItem, EditItemResult} from './edit-item/edit-item';

@Injectable()
export class RequestDialog {
  constructor(
      private dialog: MatDialog, private requestsDao: RequestsDao,
      private projectsDao: ProjectsDao, private itemsDao: ItemsDao,
      private snackBar: MatSnackBar, private selection: Selection) {}

  editDropoff(ids: string[]) {
    const config = {
      data: {requests: combineLatest(ids.map(id => this.requestsDao.get(id)))},
      autoFocus: false,
      width: '400px',
    };
    const dialogRef: MatDialogRef<EditDropoff, EditDropoffResult> =
        this.dialog.open(EditDropoff, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => {
        this.requestsDao.update(
            id, {dropoff: result.dropoff, date: result.date.toISOString()});
      });

      this.projectsDao.update(result.project, {
        defaultDropoffLocation: result.dropoff,
        defaultDropoffDate: result.date.toISOString()
      });

      this.selection.requests.clear();
    });
  }

  editTags(ids: string[]) {
    const config = {
      data: {requests: combineLatest(ids.map(id => this.requestsDao.get(id)))},
      width: '400px',
    };

    const dialogRef: MatDialogRef<EditTags, EditTagsResult> =
        this.dialog.open(EditTags, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => {
        this.requestsDao.update(id, {
          tags: result.tags,
        });
      });
      this.selection.requests.clear();
    });
  }

  editNote(ids: string[]) {
    const requests = combineLatest(ids.map(id => this.requestsDao.get(id)));
    this.openPromptDialog(ids, 'note', {
      width: '400px',
      data: {
        title: 'Edit Note',
        useTextArea: true,
        input: getMergedObjectValue(requests, 'note')
      }
    });
  }

  editItem(id: string) {
    const config = {
      data: {request: this.requestsDao.get(id)},
      width: '400px',
    };
    const dialogRef = this.dialog.open(EditItem, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(
      (result: EditItemResult) => {
        if (!result) {
          return;
        }

        this.requestsDao.update(id, result);
        this.selection.requests.clear();
      });
  }

  editPurchaser(ids: string[]) {
    const requests = combineLatest(ids.map(id => this.requestsDao.get(id)));
    this.openPromptDialog(ids, 'purchaser', {
      width: '300px',
      data: {
        title: 'Edit Purchaser',
        input: getMergedObjectValue(requests, 'purchaser')
      }
    });
  }


  editRequester(ids: string[]) {
    const requests = combineLatest(ids.map(id => this.requestsDao.get(id)));
    this.openPromptDialog(ids, 'requester', {
      width: '300px',
      data: {
        title: 'Edit Requester',
        input: getMergedObjectValue(requests, 'requester')
      }
    });
  }

  editAllocation(ids: string[]) {
    const requests = combineLatest(ids.map(id => this.requestsDao.get(id)));
    this.openPromptDialog(ids, 'allocation', {
      width: '300px',
      data: {
        title: 'Edit Allocation',
        type: 'number',
        input: getMergedObjectValue(requests, 'allocation')
      }
    });
  }

  editCostAdjustment(ids: string[]) {
    const config = {
      data: {requests: combineLatest(ids.map(id => this.requestsDao.get(id)))},
      width: '400px',
    };
    const dialogRef = this.dialog.open(EditCostAdjustment, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(
        (result: EditCostAdjustmentResult) => {
          if (!result) {
            return;
          }

          ids.forEach(id => this.requestsDao.update(id, result));
          this.selection.requests.clear();
        });
  }

  editStatus(ids: string[]) {
    const config = {
      data: {requests: combineLatest(ids.map(id => this.requestsDao.get(id)))},
      width: '400px',
    };
    const dialogRef =
        this.dialog.open<EditStatus, EditStatusData, EditStatusResult>(
            EditStatus, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => this.requestsDao.update(id, result));
      this.selection.requests.clear();
    });
  }

  deleteRequests(ids: string[]) {
    const name = ids.length > 1 ? of('these requests') :
                                  this.requestsDao.get(ids[0]).pipe(
                                      mergeMap(r => this.itemsDao.get(r.item)),
                                      map(item => `request for ${item.name}`));
    const config = {data: {name}};
    const dialogRef =
        this.dialog.open<DeleteConfirmation, DeleteConfirmationData, boolean>(
            DeleteConfirmation, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      combineLatest(ids.map(id => this.requestsDao.get(id)))
          .pipe(take(1))
          .subscribe(requests => {
            this.requestsDao.remove(ids);

            const message =
                `Removed ${ids.length > 1 ? 'requests' : 'request'}`;
            const config: MatSnackBarConfig = {duration: 5000};
            this.snackBar.open(message, 'Undo', config)
                .onAction()
                .subscribe(() => {
                  this.requestsDao.add(requests);
                });

            this.selection.requests.clear();
          });
    });
  }

  private openPromptDialog(
      ids: string[], property: string, config: MatDialogConfig) {
    const dialogRef = this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(
        (result: PromptDialogResult) => {
          if (result) {
            const update = {};
            update[property] = result.value;
            ids.forEach(id => this.requestsDao.update(id, update));
            this.selection.requests.clear();
          }
        });
  }
}
