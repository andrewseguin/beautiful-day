import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Project} from 'app/model/project';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {MediaQueryService} from 'app/service/media-query.service';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {RequestsListComponent} from 'app/ui/pages/shared/requests-list/requests-list.component';
import {Request} from 'app/model/request';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.scss'],
})
export class ProjectRequestsComponent implements OnInit {
  delayedShow: boolean;
  editPermissions: EditProjectPermissions;
  project: Observable<Project>;
  projectId: string;
  requests: Request[] = [];

  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private mediaQuery: MediaQueryService,
              private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.get(this.projectId);

      this.permissionsService.getEditPermissions(this.projectId)
          .subscribe(editPermissions => this.editPermissions = editPermissions);

      this.requestsService.getProjectRequests(this.projectId)
          .subscribe(requests => this.requests = requests);
    });

    this.requestsService.getRequestAddedStream().subscribe(response => {
      this.requestsListComponent.showRequest(response.key);
    });

    // Delay the HTML so that the page first shows up with a background.
    // This is significant for mobile
    setTimeout(() => { this.delayedShow = true; }, 0);
  }

  hideInventory(): boolean {
    return this.mediaQuery.isMobile() || !this.editPermissions.requests;
  }

  hasSelectedRequests(): boolean {
    return this.requestsService.selection.selected.length > 0;
  }

  showBudget(): boolean {
    return this.editPermissions.requests;
  }
}
