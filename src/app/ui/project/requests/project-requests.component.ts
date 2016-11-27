import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Project} from "../../../model/project";
import {RequestsService} from "../../../service/requests.service";
import {ProjectsService} from "../../../service/projects.service";
import {Request} from "../../../model/request";
import {MdSnackBar, MdMenu} from "@angular/material";
import {Item} from "../../../model/item";
import {CategoriesService} from "../../../service/categories.service";
import {Observable, Subject, BehaviorSubject} from "rxjs";
import {ItemsService} from "../../../service/items.service";

type Group = 'all' | 'category' | 'project' | 'date needed' | 'dropoff location';

class RequestGroup {
  title: Observable<string>;
  requests: Request[]
}

@Component({
  selector: 'project-requests',
  templateUrl: 'project-requests.component.html',
  styleUrls: ['project-requests.component.scss'],
  providers: [MdSnackBar]
})
export class ProjectRequestsComponent implements OnInit {
  project: FirebaseObjectObservable<Project>;
  requests: Request[] = [];
  dropoffLocations: Set<string>;
  _grouping: Group = 'all';

  projectId: string;

  requestGroups: Map<Group, RequestGroup[]> = new Map;

  @ViewChild('groupingMenu') groupingMenu: MdMenu;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.getProject(params['id']);
      this.requestsService.getProjectRequests(params['id']).subscribe(requests => {
        // Set up all grouping
        this.requestGroups.set('all', [{
          title: Observable.from(['All Requests']),
          requests: requests
        }]);

        // Set up dropoff grouping
        this.dropoffLocations = new Set();
        requests.forEach(request => this.dropoffLocations.add(request.dropoff));
        this.requestGroups.set('dropoff location', []);
        this.dropoffLocations.forEach(dropoffLocation => {
          const title = new BehaviorSubject<string>('');
          this.projectsService
            .getDropoffLocation(this.projectId, dropoffLocation)
            .subscribe(value => title.next(value.$value));
          console.log(requests.filter(request => request.dropoff === dropoffLocation))
          this.requestGroups.get('dropoff location').push({
            title: title.asObservable(),
            requests: requests.filter(request => request.dropoff === dropoffLocation)
          })
        })
      });

      this.grouping = 'all';
    });
  }

  getRequestKey(request: Request) {
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
}
