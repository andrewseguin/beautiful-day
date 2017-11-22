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
import {Item} from '../../../../model/item';
import {RequestSortPipe} from '../../../../pipe/request-sort.pipe';
import {Request} from '../../../../model/request';
import {RequestGroup} from '../../../../service/request-grouping.service';
import {RequestsService} from '../../../../service/requests.service';
import {ItemsService} from '../../../../service/items.service';
import {PermissionsService} from '../../../../service/permissions.service';
import {ProjectsService} from '../../../../service/projects.service';
import {Project} from '../../../../model/project';
import {RequestViewOptions} from '../../../../model/request-view-options';

export type Sort = 'request added' | 'item cost' | 'item name' | 'request cost' | 'date needed';

@Component({
  selector: 'requests-group',
  templateUrl: './requests-group.component.html',
  styleUrls: ['./requests-group.component.scss'],
  host: {
    '[style.display]': `processedRequests && processedRequests.length ? 'block' : 'none'`,
    '[class.mat-elevation-z4]': 'true',
    '[@groupTransition]': 'requestGroup.title',
    '(@groupTransition.done)': 'groupTransitionAnimationDone($event, requestGroup)'
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
  items: Item[];
  projects: Project[];
  requestSortPipe = new RequestSortPipe();
  processedRequests: Request[] = [];
  showRequests: boolean;

  @Input() canEdit: boolean;

  @Input() set printMode(v) { if (v) { this.showRequests = true; }}

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
      this.items = items;
      this.sortAndFilterRequests();
    });

    this.projectsService.projects.subscribe(projects => {
      this.projects = projects;
      if (this.requestGroup) {
        this.sortAndFilterRequests();
      }
    });
  }

  showRequest(requestKey: string, scrollableContent: ElementRef) {
    const newRequest = this.requestComponents.find(requestComponent => {
      return requestComponent.requestId === requestKey;
    });
    if (!newRequest) { return; }

    // Highlight the new request
    newRequest.highlight();

    // Put the item on the bottom of the view and then scoot the view down a bit
    newRequest.scrollIntoView();
    scrollableContent.nativeElement.scrollTop += 80;
  }

  sortAndFilterRequests() {
    if (!this.items || !this.projects) { return; }

    const requests = this.requestGroup.requests;
    this.processedRequests = this.requestSortPipe.transform(requests, this.sort,
        this.reverseSort, this.filter, this.items, this.projects);
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
  }

  hasAllSelectedRequests(): boolean {
    return this.requestGroup.requests.every(request => {
      return this.requestsService.isSelected(request.$key);
    });
  }

  toggleGroupSelection(select: boolean) {
    this.requestGroup.requests.forEach(request => {
      this.requestsService.setSelected(request.$key, select);
    });
  }

  groupTransitionAnimationDone(e: AnimationTransitionEvent) {
    // When the group transition finishes, load in all the remaining requests
    if (e.toState === 'void') { return; }

    setTimeout(() => { this.showRequests = true; }, 150);
  }
}
