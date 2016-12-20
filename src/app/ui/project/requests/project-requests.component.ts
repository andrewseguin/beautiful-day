import {
  Component, OnInit, ViewChild, animate, transition, style,
  state, trigger, ElementRef, QueryList, ViewChildren, AnimationTransitionEvent
} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {RequestsService, RequestAddedResponse} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {MdSnackBar, MdMenu, MdSnackBarConfig} from "@angular/material";
import {MediaQueryService} from "../../../service/media-query.service";
import {
  Group, RequestGroup,
  RequestGroupingService
} from "../../../service/request-grouping.service";
import {SubheaderService} from "../../../service/subheader.service";
import {RequestComponent} from "./request/request.component";


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
        style({transform: 'translateY(100px)'}),
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
  @ViewChildren(RequestComponent) requestComponents: QueryList<RequestComponent>;

  constructor(private route: ActivatedRoute,
              private router: Router,
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

    this.requestsService.getRequestAddedStream().subscribe(response => {
      this.requestCreated(response);
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

  requestCreated(response: RequestAddedResponse): void {
    const message = `Added request for ${response.item.name}`;
    const action = this.mediaQuery.isMobile() ? '' : 'View Request';
    const config: MdSnackBarConfig = {duration: 3000};

    const newRequest = this.requestComponents.find(requestComponent => {
      return requestComponent.getRequestKey() == response.key;
    });
    newRequest.highlight();

    const snackBarRef = this.snackBar.open(message, action, config);
    snackBarRef.onAction().subscribe(() => {
      newRequest.scrollIntoView(); // Put item on the bottom of the view

      // Scoot the view down a bit to show the item with some space
      const scrollableContentEl = this.scrollableContent.nativeElement;
      scrollableContentEl.scrollTop += 20;
    });
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

  setGroup(group: string) {
    // Set timeout so that the navigation occurs after the menu closes.
    setTimeout(() => {
      this.router.navigate([`../${group}`], {relativeTo: this.route});
    }, 0)
  }

  groupTransitionAnimationDone(e: AnimationTransitionEvent, requestGroup: RequestGroup) {
    // When the group transition finishes, load in all the remaining requests
    if (e.toState == 'void') return;

    // Create quick lookup map for the request keys in this group.
    const groupRequestIds = new Map<string, Request>();
    requestGroup.requests.forEach(request => groupRequestIds.set(request.$key, request) );

    setTimeout(() => {
      // Set each request component to be displayed after a small delay after the group anim.
      this.requestComponents.forEach(requestComponent => {
        if (groupRequestIds.has(requestComponent.requestId)) { requestComponent.show() }
      });
    }, 150);
  }
}
