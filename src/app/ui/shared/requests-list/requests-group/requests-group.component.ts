import {
  AnimationTransitionEvent,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {RequestComponent} from '../request/request.component';
import {Item} from 'app/model/item';
import {RequestSortPipe} from 'app/pipe/request-sort.pipe';
import {Request} from 'app/model/request';
import {RequestGroup} from 'app/service/request-grouping.service';
import {RequestsService} from 'app/service/requests.service';
import {ItemsService} from 'app/service/items.service';
import {PermissionsService} from 'app/service/permissions.service';
import {ProjectsService} from 'app/service/projects.service';
import {Project} from 'app/model/project';
import {RequestViewOptions} from 'app/model/request-view-options';

export type Sort = 'request added' | 'item cost' | 'item name' | 'request cost' | 'date needed';

@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  host: {
    '[style.display]': `requests && requests.length ? 'block' : 'none'`,
    '[class.mat-elevation-z4]': 'true',
    '[@groupTransition]': 'requestGroup.title',
  },
  animations: [
    trigger('groupTransition', [
      state('*', style({transform: 'translateY(0%)'})),
      state('void', style({opacity: '0'})),
      transition(':enter', [
        style({transform: 'translateY(100px)'}),
        animate('500ms ease-in-out')]
      ),
    ])
  ]
})
export class RequestsGroupComponent {
  items = new Map<string, Item>();
  projects = new Map<string, Project>();
  requestSortPipe = new RequestSortPipe();
  requests: Request[] = [];
  displayedRequests: Request[] = [];

  showAllRequests = false;

  set requestsToDisplay(v: number) {
    this._requestsToDisplay = v;
    this.updateDisplayedRequests();
  }
  get requestsToDisplay(): number { return this._requestsToDisplay; }
  _requestsToDisplay = 10;

  @Input() canEdit: boolean;

  @Input() set printMode(v) { if (v) { this.showAllRequests = true; }}

  @ViewChildren(RequestComponent) requestComponents: QueryList<RequestComponent>;

  _filter: string;
  @Input() set filter(filter: string) {
    this._filter = filter;
    if (this.requestGroup) { this.sortAndFilterRequests(); }
  }
  get filter(): string { return this._filter; }

  _sort: Sort;
  @Input() set sort(sort: Sort) {
    this._sort = sort;
    if (this.requestGroup) { this.sortAndFilterRequests(); }
  }
  get sort(): Sort { return this._sort; }

  _reverseSort: boolean;
  @Input() set reverseSort(reverseSort: boolean) {
    this._reverseSort = reverseSort;
    if (this.requestGroup) { this.sortAndFilterRequests(); }
  }
  get reverseSort(): boolean { return this._reverseSort; }

  _requestGroup: RequestGroup;
  @Input() set requestGroup(requestGroup: RequestGroup) {
    this._requestGroup = requestGroup;
    this.sortAndFilterRequests();
  }
  get requestGroup(): RequestGroup { return this._requestGroup; }

  @Input() requestViewOptions: RequestViewOptions;

  _projectId: string;
  @Input() set projectId(projectId: string) {
    this._projectId = projectId;

    if (projectId === 'all') {
      this.canEdit = true;
    } else {
      this.permissionsService.getEditPermissions(projectId)
          .subscribe(editPermissions => this.canEdit = editPermissions.requests);
    }
  }
  get projectId(): string { return this._projectId; }

  @Output() filterTag = new EventEmitter<string>();

  constructor(private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private permissionsService: PermissionsService) {
    this.itemsService.items.subscribe(items => {
      items.forEach(item => this.items.set(item.$key, item));
      this.sortAndFilterRequests();
    });

    this.projectsService.projects.subscribe(projects => {
      projects.forEach(project => this.projects.set(project.$key, project));
      if (this.requestGroup) {
        this.sortAndFilterRequests();
      }
    });
  }

  showRequest(requestKey: string, scrollableContent: ElementRef) {
    const newRequest = this.requestComponents.find(requestComponent => {
      return requestComponent.request.$key === requestKey;
    });
    if (!newRequest) { return; }

    // Highlight the new request
    newRequest.highlight();

    // Put the item on the bottom of the view and then scoot the view down a bit
    newRequest.scrollIntoView();
    scrollableContent.nativeElement.scrollTop += 80;
  }

  sortAndFilterRequests() {
    if (!this.projects.size || !this.items.size) { return; }
    const requests = this.requestGroup.requests;

    const itemsList = [];
    this.items.forEach(item => itemsList.push(item));

    const projectsList = [];
    this.projects.forEach(project => projectsList.push(project));

    this.requests = this.requestSortPipe.transform(requests, this.sort,
        this.reverseSort, this.filter, itemsList, projectsList);
    this.updateDisplayedRequests();
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
  }

  hasAllSelectedRequests(): boolean {
    return this.requestGroup.requests.every(request => {
      return this.requestsService.selection.isSelected(request.$key);
    });
  }

  toggleGroupSelection(select: boolean) {
    this.requestGroup.requests.forEach(request => {
      select ?
        this.requestsService.selection.select(request.$key) :
        this.requestsService.selection.deselect(request.$key);
    });
  }

  updateDisplayedRequests() {
    if (this.requestsToDisplay >= this.requests.length) {
      this.showAllRequests = true;
    }

    this.displayedRequests = this.showAllRequests ?
      this.requests :
      this.requests.slice(0, this.requestsToDisplay);
  }
}
