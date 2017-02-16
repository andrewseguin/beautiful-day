import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  EventEmitter,
  Output
} from "@angular/core";
import {PermissionsService, EditPermissions} from "../../../service/permissions.service";
import {
  RequestGroupingService,
  RequestGroup,
  Group
} from "../../../service/request-grouping.service";
import {RequestsGroupComponent} from "./requests-group/requests-group.component";
import {Request} from "../../../model/request";
import {DisplayOptions} from "../../../model/display-options";

@Component({
  selector: 'requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  providers: [RequestGroupingService]
})
export class RequestsListComponent {
  editPermissions: EditPermissions;

  requestGroups: Map<Group, RequestGroup[]>;
  requestsCount: number = null;

  @ViewChildren(RequestsGroupComponent) requestsGroups: QueryList<RequestsGroupComponent>;

  @Output() displayOptionsChanged = new EventEmitter<DisplayOptions>();

  _displayOptions: DisplayOptions =  {
    filter: '',
    grouping: 'all',
    sorting: 'request added',
    viewing: {
      cost: true,
      dropoff: true,
      notes: true,
      tags: true,
    },
  };
  @Input() set displayOptions(displayOptions: DisplayOptions) {
    if (displayOptions) { this._displayOptions = displayOptions; }
  }
  get displayOptions(): DisplayOptions { return this._displayOptions; }

  @Input() set requests(requests: Request[]) {
    this.requestGroupingService.requests = requests;
    this.requestsCount = requests.length;
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
    console.log(this.displayOptions.filter, filter)
    // Make a new object so that the display options can see the change in reference.
    this.displayOptions = {
      filter: filter,
      grouping: this.displayOptions.grouping,
      sorting: this.displayOptions.sorting,
      viewing: this.displayOptions.viewing,
    };
    this.displayOptionsChanged.next(this.displayOptions);
  }

  getRequestGroupKey(index: number, requestGroup: RequestGroup) {
    return requestGroup.id;
  }

  updateDisplayOptions(displayOptions) {
    this.displayOptions = displayOptions;
    this.displayOptionsChanged.next(displayOptions);
  }

  showRequest(requestId: string, scrollableContent: ElementRef) {
    // Run through all the groups and ask to highlight and scroll to the request,
    // one of the groups should match.
    this.requestsGroups.forEach(requestsGroup => {
      requestsGroup.showRequest(requestId, scrollableContent);
    });
  }
}
