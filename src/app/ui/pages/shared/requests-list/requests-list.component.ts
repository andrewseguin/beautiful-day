import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {
  Group,
  RequestGroup,
  RequestGroupingService
} from 'app/service/request-grouping.service';
import {RequestsGroupComponent} from './requests-group/requests-group.component';
import {Request} from 'app/model/request';
import {DisplayOptions} from 'app/model/display-options';
import {EXPANSION_ANIMATION} from 'app/ui/shared/animations';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  providers: [RequestGroupingService],
  animations: EXPANSION_ANIMATION
})
export class RequestsListComponent {
  expanded = false;
  search = new FormControl('');

  editPermissions: EditProjectPermissions;

  requestGroups: Map<Group, RequestGroup[]>;
  requestsCount: number = null;

  @ViewChildren(RequestsGroupComponent) requestsGroups: QueryList<RequestsGroupComponent>;

  @Output() displayOptionsChanged = new EventEmitter<DisplayOptions>();

  _displayOptions: DisplayOptions =  {
    filter: '',
    grouping: 'all',
    sorting: 'request added',
    reverseSort: false,
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
    this.search.registerOnChange(change => {
      console.log(change);
    });

    this.search.valueChanges.pipe(debounceTime(100))
        .subscribe(value => this.setFilter(value));

    this.requestGroupingService.groupsUpdated
        .subscribe(requestGroups => this.requestGroups = requestGroups);
  }

  setFilter(filter: string) {
    // Make a new object so that the display options can see the change in reference.
    this.displayOptions = {
      filter: filter,
      grouping: this.displayOptions.grouping,
      sorting: this.displayOptions.sorting,
      reverseSort: this.displayOptions.reverseSort,
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
