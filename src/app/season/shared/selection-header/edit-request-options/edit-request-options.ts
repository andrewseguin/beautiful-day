import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {RequestsDao} from 'app/season/dao';
import {Selection} from 'app/season/services';
import {Permissions} from 'app/season/services/permissions';
import {RequestDialog} from 'app/season/shared/dialog/request/request-dialog';
import {combineLatest, Subject} from 'rxjs';
import {startWith, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'edit-request-options',
  templateUrl: 'edit-request-options.html',
  styleUrls: ['edit-request-options.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditRequestOptions {
  hasPurchased = true;

  private destroyed = new Subject();

  constructor(private requestsDao: RequestsDao,
              public selection: Selection,
              private cd: ChangeDetectorRef,
              public requestDialog: RequestDialog,
              public permissions: Permissions) {
    // Cannot delete requests that have already been purchased
    this.selection.requests.changed.pipe(
        startWith(null),
        takeUntil(this.destroyed))
        .subscribe(() => {
          const requestsStream = this.selection.requests.selected.map(r => this.requestsDao.get(r));
          combineLatest(requestsStream).pipe(take(1)).subscribe(requests => {
            this.hasPurchased = requests.some(r => r.isPurchased);
            this.cd.markForCheck();
          });
        });
  }

  getSelectedRequestsCount() {
    return this.selection.requests.selected.length;
  }
}
