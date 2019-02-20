import {ChangeDetectionStrategy, Component, Input, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {RequestsDao} from 'app/season/dao';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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

  @Input()
  set allocation(allocation: number) {
    if (allocation !== this.formControl.value) {
      this.formControl.setValue(allocation || 0, {emitEvent: false});
    }
  }

  formControl = new FormControl(0);

  constructor(private requestsDao: RequestsDao) {
    this.formControl.valueChanges.pipe(takeUntil(this.destroyed))
        .subscribe(allocation => {
          this.requestsDao.update(this.requestId, {allocation});
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
