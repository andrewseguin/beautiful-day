import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PromptDialogComponent} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog.component';
import {Selection} from 'app/ui/season/services';
import {RequestsDao} from 'app/ui/season/dao';

@Injectable()
export class RequestDialog {
  constructor(private dialog: MatDialog,
              private requestsDao: RequestsDao,
              private selection: Selection) {}

  editNote(requestIds: string[]) {
    const dialogRef = this.dialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Edit Note';
    if (requestIds.length === 1) {
      requestIds.forEach(id => {
        this.requestsDao.get(id).subscribe(request => {
          dialogRef.componentInstance.input = request.note;
        });
      });
    }

    dialogRef.componentInstance.onSave().subscribe(note => {
      requestIds.forEach(requestId => this.requestsDao.update(requestId, {note: <string>note}));
      this.selection.requests.clear();
    });
  }
}
