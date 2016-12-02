import {
  Component, OnInit, ViewChild, animate, transition, style,
  state, trigger
} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {RequestsService} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {MdSnackBar, MdMenu} from "@angular/material";
import {Item} from "../../../model/item";
import {Observable, BehaviorSubject} from "rxjs";
import {MediaQueryService} from "../../../service/media-query.service";
import {Group, RequestGroup} from "../../../service/request-grouping.service";


@Component({
  selector: 'project-requests',
  templateUrl: 'project-requests.component.html',
  styleUrls: ['project-requests.component.scss'],
  providers: [MdSnackBar],
  animations: [
    trigger('groupTransition', [
      state('*', style({transform: 'translateY(0%)'})),
      state('void', style({opacity: '0'})),
      transition(':enter', [
        style({transform: 'translateY(10%)'}),
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ]
})
export class ProjectRequestsComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  dropoffLocations: Set<string>;
  _grouping: Group = 'all';
  projectId: string;

  requestGroups: Map<Group, RequestGroup[]> = new Map;

  @ViewChild('groupingMenu') groupingMenu: MdMenu;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private mediaQuery: MediaQueryService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.requestGroups.set('all', [{
      title: 'All Requests',
      requests: []
    }]);
    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.getProject(params['id']);
      this.requestsService.getProjectRequests(params['id']).subscribe(requests => {
        this.requestGroups.get('all')[0].requests = requests;

        // Set up dropoff grouping
        this.dropoffLocations = new Set();
        requests.forEach(request => this.dropoffLocations.add(request.dropoff));
        this.requestGroups.set('dropoff location', []);
        this.dropoffLocations.forEach(dropoffLocation => {
          this.requestGroups.get('dropoff location').push({
            title: dropoffLocation,
            requests: requests.filter(request => request.dropoff === dropoffLocation)
          })
        });
      });

      this.grouping = 'all';
    });
  }

  log() {
    console.log();
  }

  getRequestKey(index: number, request: Request) {
    return request.$key;
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
}
