import {
  Component, OnInit, ViewChild, animate, transition, style,
  state, trigger, ElementRef
} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {RequestsService} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {MdSnackBar, MdMenu} from "@angular/material";
import {Item} from "../../../model/item";
import {Observable, BehaviorSubject} from "rxjs";
import {MediaQueryService} from "../../../service/media-query.service";
import {
  Group, RequestGroup,
  RequestGroupingService
} from "../../../service/request-grouping.service";
import {SubheaderService} from "../../../service/subheader.service";


@Component({
  selector: 'project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.scss'],
  providers: [MdSnackBar],
  animations: [
    trigger('groupTransition', [
      state('*', style({transform: 'translateY(0%)'})),
      state('void', style({opacity: '0'})),
      transition(':enter', [
        style({transform: 'translateY(10%)'}),
        animate('500ms ease-in-out')]
      ),
    ])
  ]
})
export class ProjectRequestsComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  _grouping: Group = 'all';
  projectId: string;

  latestScrollPosition = 0;

  requestGroups: Map<Group, RequestGroup[]>;

  @ViewChild('groupingMenu') groupingMenu: MdMenu;
  @ViewChild('scrollableContent') scrollableContent: ElementRef;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestGroupingService: RequestGroupingService,
              private requestsService: RequestsService,
              private mediaQuery: MediaQueryService,
              private subheaderService: SubheaderService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.getProject(params['id']);
      this.requestGroups = this.requestGroupingService.getRequestGroups(params['id']);
    });

    this.route.params.subscribe((params: Params) => {
      this.grouping = params['group'];
    });
  }

  checkSubheader() {
    let scrollPosition = this.scrollableContent.nativeElement.scrollTop;
    if (scrollPosition > 60 && scrollPosition > this.latestScrollPosition) {
      this.subheaderService.visibility(false);
    }

    if (scrollPosition < (this.latestScrollPosition - 60) ||
        scrollPosition < 100) {
      this.subheaderService.visibility(true);
      this.latestScrollPosition = scrollPosition;
    }

    if (scrollPosition > this.latestScrollPosition) {
      this.latestScrollPosition = scrollPosition;
    }
  }

  getGroups(): string[] {
    return this.requestGroupingService.getGroupNames();
  }

  isLoadingRequests(): boolean {
    return !!this.requestGroups;
  }

  hasRequests(): boolean {
    const allRequests = this.requestGroups.get('all');
    return !!allRequests && allRequests[0] && allRequests[0].requests.length > 0;
  }

  getGroupingName(grouping: string): string {
    switch (grouping) {
      case 'all': return 'All';
      case 'category': return 'Category';
      case 'date': return 'Date Needed';
      case 'dropoff': return 'Dropoff Location';
    }
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
  }
  getRequestGroupKey(index: number, requestGroup: RequestGroup) {
    return requestGroup.id;
  }

  showSnackbar(item: Item): void {
    // TODO: Add action for viewing the new request
    this.snackBar.open(`Added request for ${item.name}`);
  }

  get grouping(): Group { return this._grouping; }
  set grouping(group: Group) {
    this._grouping = group;
  }

  hideInventory(): boolean {
    return this.mediaQuery.isMobile();
  }

  hasSelectedRequests(): boolean {
    return this.requestsService.getSelectedRequests().size > 0;
  }

  hasAllSelectedRequests(requests: Request[]): boolean {
    return requests.every(request => {
      return this.requestsService.isSelected(request.$key);
    })
  }

  toggleGroupSelection(select: boolean, requests: Request[]) {
    requests.forEach(request => {
      this.requestsService.setSelected(request.$key, select);
    })
  }
}
