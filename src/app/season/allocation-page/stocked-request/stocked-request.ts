import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ItemsDao, Request, RequestsDao} from 'app/season/dao';
import {RequestDialog} from 'app/season/shared/dialog/request/request-dialog';
import {ViewRequest, ViewRequestData} from 'app/season/shared/dialog/request/view-request/view-request';
import {Subject} from 'rxjs';
import {mergeMap, take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'stocked-request',
  templateUrl: 'stocked-request.html',
  styleUrls: ['stocked-request.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockedRequest {
  private destroyed = new Subject();

  @Input() requestId: string;
  @Input() project: string;
  @Input() requested: number;

  @Input()
  set allocation(allocation: number) {
    if (allocation !== this.formControl.value) {
      this.formControl.setValue(allocation || 0, {emitEvent: false});
    }
  }

  formControl = new FormControl(0);

  constructor(
      private requestsDao: RequestsDao, private itemsDao: ItemsDao,
      private dialog: MatDialog) {
    this.formControl.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(allocation => {
          this.requestsDao.update(this.requestId, {allocation});
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  showRequest() {
    const data: ViewRequestData = {};
    this.requestsDao.get(this.requestId)
        .pipe(
            mergeMap((request: Request) => {
              data.request = request;
              return this.itemsDao.get(request.item);
            }),
            take(1))
        .subscribe(item => {
          data.item = item;
          this.dialog.open(ViewRequest, {width: '650px', data});
        });
  }
}
