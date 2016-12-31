import {Component, OnInit, ViewChild, ElementRef, QueryList, ViewChildren} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../../model/project";
import {RequestsService, RequestAddedResponse} from "../../../../service/requests.service";
import {ProjectsService} from "../../../../service/projects.service";
import {MdMenu, MdInput} from "@angular/material";
import {MediaQueryService} from "../../../../service/media-query.service";
import {
  Group,
  RequestGroup,
  RequestGroupingService
} from "../../../../service/request-grouping.service";
import {SubheaderService} from "../../../../service/subheader.service";
import {RequestsGroupComponent, Sort} from "./requests-group/requests-group.component";
import {Request} from "../../../../model/request";


export class RequestViewOptions {
  cost: boolean = true;
  dropoff: boolean = true;
  notes: boolean = true;
  tags: boolean = true;

  clone(): RequestViewOptions {
    const clone = new RequestViewOptions();
    clone.cost = this.cost;
    clone.dropoff = this.dropoff;
    clone.notes = this.notes;
    clone.tags = this.tags;
    return clone;
  }
}

@Component({
  selector: 'project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.scss'],
})
export class ProjectRequestsComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  grouping: Group = 'all';
  sorting: Sort = 'request added';
  projectId: string;
  requestViewOptions: RequestViewOptions = new RequestViewOptions();

  filter: string = '';
  showFilter: boolean = false;

  latestScrollPosition = 0;

  requestGroups: Map<Group, RequestGroup[]>;

  @ViewChild('groupingMenu') groupingMenu: MdMenu;
  @ViewChild('scrollableContent') scrollableContent: ElementRef;
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChildren(RequestsGroupComponent) requestsGroups: QueryList<RequestsGroupComponent>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectsService: ProjectsService,
              private requestGroupingService: RequestGroupingService,
              private requestsService: RequestsService,
              private mediaQuery: MediaQueryService,
              private subheaderService: SubheaderService) { }

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

  getAllRequests(): Request[] | null {
    if (!this.requestGroups) { return; }

    const allRequests = this.requestGroups.get('all') && this.requestGroups.get('all')[0];
    if (!allRequests) { return; }

    return allRequests.requests;
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

  getRequestGroupKey(index: number, requestGroup: RequestGroup) {
    return requestGroup.id;
  }

  requestCreated(response: RequestAddedResponse): void {
    // Run through all the groups and ask to highlight and scroll to the request,
    // one of the groups should match.
    this.requestsGroups.forEach(requestsGroup => {
      requestsGroup.showRequest(response.key, this.scrollableContent)
    });
  }

  hideInventory(): boolean {
    return this.mediaQuery.isMobile();
  }

  hasSelectedRequests(): boolean {
    return this.requestsService.getSelectedRequests().size > 0;
  }

  setGroup(group: string) {
    // Set timeout so that the navigation occurs after the menu closes.
    setTimeout(() => {
      this.router.navigate([`../${group}`], {relativeTo: this.route});
    }, 0)
  }

  getRequestViewOptionKeys() {
    return Object.keys(this.requestViewOptions);
  }

  toggleRequestViewOption(option: string) {
    // Create new set of options so that the children components are passed a new
    // reference and they will know to update.
    this.requestViewOptions = this.requestViewOptions.clone();
    this.requestViewOptions[option] = !this.requestViewOptions[option];
  }

  getSortOptions(): Sort[] {
    return ['request added', 'cost', 'item'];
  }
}
