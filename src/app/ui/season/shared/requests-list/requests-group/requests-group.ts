import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Request, Item} from 'app/ui/season/dao';
import {ItemsDao} from 'app/ui/season/dao';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Component({
  selector: 'requests-group',
  templateUrl: 'requests-group.html',
  styleUrls: ['requests-group.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsGroup {
  items = new Map<string, Item>();

  @Input() canEdit: boolean;

  @Input() printMode: boolean;

  @Input() requests: Request[];

  @Input() title: string;

  getRequestKey = (_i, request: Request) => request.id;

  private destroyed = new Subject();

  constructor(private itemsDao: ItemsDao,
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
