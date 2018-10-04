import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Item} from 'app/model/item';
import {Request} from 'app/model/request';
import {RequestsService} from 'app/service/requests.service';
import {PermissionsService} from 'app/service/permissions.service';
import {GroupsService} from 'app/service/groups.service';
import {ItemsService} from 'app/service/items.service';


@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  host: {
    'class': 'mat-elevation-z4'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsGroupComponent {
  items = new Map<string, Item>();
  isAcquisitions = false;

  @Input() canEdit: boolean;

  @Input() printMode: boolean;

  @Input() projectId: string;

  @Input() requests: Request[];

  @Input() title: string;

  @Output() filterTag = new EventEmitter<string>();

  getRequestKey = (_i, request: Request) => request.$key;

  constructor(private requestsService: RequestsService,
              private groupsService: GroupsService,
              private itemsService: ItemsService,
              private cd: ChangeDetectorRef,
              private permissionsService: PermissionsService) {
    this.itemsService.itemsMap.subscribe(itemsMap => {
      this.items = itemsMap;
      this.cd.markForCheck();
    });

    this.groupsService.isMember('acquisitions').subscribe(flag => {
      this.isAcquisitions = flag;
    });
  }

  ngOnInit() {
    if (this.projectId === 'all') {
      this.canEdit = true;
    } else {
      this.permissionsService.getEditPermissions(this.projectId)
        .subscribe(editPermissions => this.canEdit = editPermissions.requests);
    }
  }

  hasAllSelectedRequests(): boolean {
    return this.requests.every(request => {
      return this.requestsService.selection.isSelected(request.$key);
    });
  }

  toggleGroupSelection(select: boolean) {
    this.requests.forEach(request => {
      select ?
        this.requestsService.selection.select(request.$key) :
        this.requestsService.selection.deselect(request.$key);
    });
  }
}
