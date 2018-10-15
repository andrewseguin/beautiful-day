import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';
import {RequestsService} from 'app/service/requests.service';
import {GroupsService} from 'app/service/groups.service';
import {ItemsService} from 'app/service/items.service';


@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsGroupComponent {
  items = new Map<string, Item>();
  isAcquisitions = false;

  @Input() canEdit: boolean;

  @Input() printMode: boolean;

  @Input() requests: Request[];

  @Input() title: string;

  getRequestKey = (_i, request: Request) => request.$key;

  constructor(private requestsService: RequestsService,
              private groupsService: GroupsService,
              private itemsService: ItemsService,
              private cd: ChangeDetectorRef) {
    this.itemsService.itemsMap.subscribe(itemsMap => {
      this.items = itemsMap;
      this.cd.markForCheck();
    });

    this.groupsService.isMember('acquisitions').subscribe(flag => {
      this.isAcquisitions = flag;
    });
  }

  selectAll() {
    this.requests.forEach(request => {
      this.requestsService.selection.select(request.$key);
    });
  }
}
