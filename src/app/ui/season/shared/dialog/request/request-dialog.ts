import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {
  PromptDialog,
  PromptDialogData,
  PromptDialogResult
} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog';
import {Selection} from 'app/ui/season/services';
import {ProjectsDao, RequestsDao} from 'app/ui/season/dao';
import {map, take} from 'rxjs/operators';
import {combineLatest, of} from 'rxjs';
import {
  EditDropoff,
  EditDropoffResult
} from 'app/ui/season/shared/dialog/request/edit-dropoff/edit-dropoff';
import {EditTags, EditTagsResult} from 'app/ui/season/shared/dialog/request/edit-tags/edit-tags';
import {
  EditStatus,
  EditStatusData,
  EditStatusResult
} from 'app/ui/season/shared/dialog/request/edit-status/edit-status';
import {
  DeleteConfirmation,
  DeleteConfirmationData
} from 'app/ui/season/shared/dialog/delete-confirmation/delete-confirmation';

@Injectable()
export class RequestDialog {
  constructor(private dialog: MatDialog,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao,
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
        lastUsedDropoff: result.dropoff,
        lastUsedDate: result.date.toISOString()
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
    };

    if (ids.length === 1) {
      data.input = this.requestsDao.get(ids[0]).pipe(map(r => r.note));
    } else {
      // TODO: If all requests have the same note, use it.
      data.input = of('');
    }

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
    const config = {
      data: {
        requests: combineLatest(ids.map(id => this.requestsDao.get(id)))
      },
    };
    const dialogRef = this.dialog
        .open<DeleteConfirmation, DeleteConfirmationData, boolean>(DeleteConfirmation, config);
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (!result) {
        return;
      }

      ids.forEach(id => this.requestsDao.remove(id));

      const message = `Removed ${this.selection.requests.selected.length} requests`;
      const config: MatSnackBarConfig = {duration: 3000};
      this.snackBar.open(message, null, config);

      this.selection.requests.clear();

    });
  }
}
