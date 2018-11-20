import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, Output
} from '@angular/core';
import {Request, Item} from 'app/season/dao';
import {ItemsDao} from 'app/season/dao';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Selection} from 'app/season/services';


@Component({
  selector: 'requests-group',
  templateUrl: 'requests-group.html',
  styleUrls: ['requests-group.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsGroup {
  items = new Map<string, Item>();

  @Input() requests: Request[];

  @Input() title: string;

  getRequestKey = (_i, request: Request) => request.id;

  @Output() selectGroup = new EventEmitter();

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
              private selection: Selection,
              private cd: ChangeDetectorRef) {
    this.itemsDao.map.pipe(takeUntil(this.destroyed)).subscribe(itemsMap => {
      this.items = itemsMap;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
