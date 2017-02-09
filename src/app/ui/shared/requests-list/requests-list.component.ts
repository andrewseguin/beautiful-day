import {Component, Input, ViewChildren, QueryList, ElementRef} from '@angular/core';
import {
  RequestViewOptions,
  DisplayOptions
} from './display-options-header/display-options-header.component';
import {PermissionsService, EditPermissions} from '../../../service/permissions.service';
import {RequestsService} from '../../../service/requests.service';
import {
  RequestGroupingService,
  RequestGroup,
  Group
} from '../../../service/request-grouping.service';
import {RequestsGroupComponent} from './requests-group/requests-group.component';
import {Request} from "../../../model/request";

@Component({
  selector: 'requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  providers: [RequestGroupingService]
})
export class RequestsListComponent {
  requestViewOptions: RequestViewOptions = new RequestViewOptions();
  displayOptions: DisplayOptions = {
    filter: '',
    grouping: 'all',
    sorting: 'request added',
    viewing: new RequestViewOptions(),
  };
  editPermissions: EditPermissions;

  requestGroups: Map<Group, RequestGroup[]>;
  requestsCount: number = null;

  @ViewChildren(RequestsGroupComponent) requestsGroups: QueryList<RequestsGroupComponent>;

  @Input() set requests(requests: Request[]) {
    this.requestGroupingService.requests = requests;
    this.requestsCount = requests.length;
    if (requests.length == 0) {
      this.setFilter('');
    }
  }

  @Input() printMode: boolean;

  _projectId: string;
  @Input() set projectId(projectId: string) {
    this._projectId = projectId;
    this.permissionsService.getEditPermissions(projectId)
        .subscribe(editPermissions => this.editPermissions = editPermissions);
  }
  get projectId(): string { return this._projectId; }

  constructor(private requestGroupingService: RequestGroupingService,
              private permissionsService: PermissionsService) {
    this.requestGroupingService.groupsUpdated
        .subscribe(requestGroups => this.requestGroups = requestGroups);
  }

  setFilter(filter: string) {
    // Make a new object so that the display options can see the change in reference.
    this.displayOptions = {
      filter: filter,
      grouping: this.displayOptions.grouping,
      sorting: this.displayOptions.sorting,
      viewing: this.displayOptions.viewing,
    }
  }

  getRequestGroupKey(index: number, requestGroup: RequestGroup) {
    return requestGroup.id;
  }

  updateDisplayOptions(displayOptions) {
    this.displayOptions = displayOptions;
  }

  showRequest(requestId: string, scrollableContent: ElementRef) {
    // Run through all the groups and ask to highlight and scroll to the request,
    // one of the groups should match.
    this.requestsGroups.forEach(requestsGroup => {
      requestsGroup.showRequest(requestId, scrollableContent);
    });
  }
}
