import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Project} from 'app/model/project';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {RequestsListComponent} from 'app/ui/pages/shared/requests-list/requests-list.component';
import {Request} from 'app/model/request';
import {Observable} from 'rxjs/Observable';
import {Filter} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {isMobile} from 'app/utility/media-matcher';

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
  projectKeyFilter: Filter = {type: 'projectKey', isImplicit: true};

  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.get(this.projectId);
      this.projectKeyFilter.query = {key: this.projectId};

      this.permissionsService.getEditPermissions(this.projectId)
          .subscribe(editPermissions => this.editPermissions = editPermissions);

      this.requestsService.getProjectRequests(this.projectId)
          .subscribe(requests => this.requests = requests);
    });

    this.requestsService.getRequestAddedStream().subscribe(response => {
      // Can highlight a request if wanted
    });

    // Delay the HTML so that the page first shows up with a background.
    // This is significant for mobile
    setTimeout(() => { this.delayedShow = true; }, 0);
  }

  hideInventory(): boolean {
    return isMobile() || !this.editPermissions.requests;
  }

  hasSelectedRequests(): boolean {
    return this.requestsService.selection.selected.length > 0;
  }

  showBudget(): boolean {
    return this.editPermissions.requests;
  }
}
