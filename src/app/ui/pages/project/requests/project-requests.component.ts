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
import {HeaderService} from 'app/service/header.service';
import {CdkPortal} from '@angular/cdk/portal';

@Component({
  selector: 'project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.scss'],
})
export class ProjectRequestsComponent implements OnInit {
  editPermissions: EditProjectPermissions;
  project: Observable<Project>;
  projectId: string;
  requests: Request[] = [];
  projectKeyFilter: Filter = {type: 'projectKey', isImplicit: true};

  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;
  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  constructor(private route: ActivatedRoute,
              private titleService: HeaderService,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private permissionsService: PermissionsService) { }

  ngOnInit() {
    this.titleService.toolbarOutlet = this.toolbarActions;
    this.route.parent.params.subscribe((params: Params) => {
      this.projectId = params['id'];
      this.project = this.projectsService.get(this.projectId);
      this.projectKeyFilter.query = {key: this.projectId};

      this.permissionsService.getEditPermissions(this.projectId)
          .subscribe(editPermissions => this.editPermissions = editPermissions);

      this.requestsService.getProjectRequests(this.projectId)
          .subscribe(requests => this.requests = requests);
    });
  }

  ngOnDestroy() {
    this.titleService.toolbarOutlet = null;
  }

  hideInventory(): boolean {
    return isMobile() || !this.editPermissions.requests;
  }

  hasSelectedRequests(): boolean {
    return this.requestsService.selection.selected.length > 0;
  }

  showBudget(): boolean {
    return this.editPermissions && this.editPermissions.requests;
  }
}
