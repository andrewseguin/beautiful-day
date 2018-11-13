import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {
  PromptDialog,
  PromptDialogData,
  PromptDialogResult
} from 'app/season/shared/dialog/prompt-dialog/prompt-dialog';
import {Selection} from 'app/season/services';
import {ItemsDao, ProjectsDao, RequestsDao} from 'app/season/dao';
import {map, mergeMap, take} from 'rxjs/operators';
import {combineLatest, of} from 'rxjs';
import {
  EditDropoff,
  EditDropoffResult
} from 'app/season/shared/dialog/request/edit-dropoff/edit-dropoff';
import {EditTags, EditTagsResult} from 'app/season/shared/dialog/request/edit-tags/edit-tags';
import {
  EditStatus,
  EditStatusData,
  EditStatusResult
} from 'app/season/shared/dialog/request/edit-status/edit-status';
import {
  DeleteConfirmation,
  DeleteConfirmationData
} from 'app/season/shared/dialog/delete-confirmation/delete-confirmation';

@Injectable()
export class RequestDialog {
  constructor(private dialog: MatDialog,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao,
              private itemsDao: ItemsDao,
              private snackBar: MatSnackBar,
              private selection: Selection) {}

  editDropoff(ids: string[]) {
    const config = {
      data: {
        requests: combineLatest(ids.map(id => this.requestsDao.get(id)))
      },
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
        this.requestsDao.update(id, {
          dropoff: result.dropoff,
          date: result.date.toISOString()
        });
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
      data: {
        requests: combineLatest(ids.map(id => this.requestsDao.get(id)))
      },
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
    const data: PromptDialogData = {
      title: 'Edit Note',
      useTextArea: true,
      input: combineLatest(ids.map(id => this.requestsDao.get(id))).pipe(
          map(requests => {
            const firstNote = requests[0].note;
            return requests.every(r => r.note === firstNote) ? firstNote : '';
          })
      )
    };

    const config = {data, width: '400px'};
    const dialogRef: MatDialogRef<PromptDialog, PromptDialogResult> =
      this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => {
        this.requestsDao.update(id, {note: result.value as string});
        this.selection.requests.clear();
      });
    });
  }

  // TODO: Consider combining with editNote, or any other prompt dialog function
  editPurchaser(ids: string[]) {
    const data: PromptDialogData = {
      title: 'Edit Purchaser',
    };

    if (ids.length === 1) {
      data.input = this.requestsDao.get(ids[0]).pipe(map(r => r.purchaser));
    } else {
      // TODO: If all requests have the same purchaser, use it.
      data.input = of('');
    }

    const config = {data, width: '300px'};
    const dialogRef: MatDialogRef<PromptDialog, PromptDialogResult> =
      this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => {
        this.requestsDao.update(id, {purchaser: result.value as string});
        this.selection.requests.clear();
      });
    });
  }

  // TODO: Consider combining with editNote, or any other prompt dialog function
  editAllocation(ids: string[]) {
    const data: PromptDialogData = {
      title: 'Edit Allocation',
    };

    if (ids.length === 1) {
      data.input = this.requestsDao.get(ids[0]).pipe(map(r => r.allocation));
    } else {
      // TODO: If all requests have the same purchaser, use it.
      data.input = of(0);
    }

    const config = {data, width: '300px'};
    const dialogRef: MatDialogRef<PromptDialog, PromptDialogResult> =
      this.dialog.open(PromptDialog, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => {
        this.requestsDao.update(id, {allocation: result.value as number});
        this.selection.requests.clear();
      });
    });
  }

  editStatus(ids: string[]) {
    const config = {
      data: {
        requests: combineLatest(ids.map(id => this.requestsDao.get(id)))
      },
      width: '400px',
    };
    const dialogRef = this.dialog
        .open<EditStatus, EditStatusData, EditStatusResult>(EditStatus, config);
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
    const dialogRef = this.dialog
        .open<DeleteConfirmation, DeleteConfirmationData, boolean>(DeleteConfirmation, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      combineLatest(ids.map(id => this.requestsDao.get(id))).pipe(
          take(1))
          .subscribe(requests => {
            ids.forEach(id => this.requestsDao.remove(id));

            const message = `Removed ${ids.length > 1 ? 'requests' : 'request'}`;
            const config: MatSnackBarConfig = {duration: 5000};
            this.snackBar.open(message, 'Undo', config).onAction().subscribe(() => {
              requests.forEach(request => this.requestsDao.add(request));
            });

            this.selection.requests.clear();
          });


    });
  }
}
