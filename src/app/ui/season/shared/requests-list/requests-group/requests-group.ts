import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';
import {ItemsDao} from 'app/ui/season/dao';


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

  constructor(private itemsDao: ItemsDao,
              private cd: ChangeDetectorRef) {
    this.itemsDao.map.subscribe(itemsMap => {
      this.items = itemsMap;
      this.cd.markForCheck();
    });
  }
}
