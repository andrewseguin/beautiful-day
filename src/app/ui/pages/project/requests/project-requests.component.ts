import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'app/model/project';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {RequestsListComponent} from 'app/ui/pages/shared/requests-list/requests-list.component';
import {Request} from 'app/model/request';
import {
  Filter,
  RequestRendererOptions, RequestRendererOptionsState
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
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
  requests: Request[];
  renderRequestsOptionsState: RequestRendererOptionsState;

  @Input() project: Project;

  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;
  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  constructor(private route: ActivatedRoute,
              private headerService: HeaderService,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private permissionsService: PermissionsService) {
  }

  ngOnInit() {
    this.headerService.toolbarOutlet = this.toolbarActions;

    const renderRequestsOptions = new RequestRendererOptions();
    renderRequestsOptions.filters = [{
      type: 'projectKey',
      query: { key: this.project.$key },
      isImplicit: true
    }];
    this.renderRequestsOptionsState = renderRequestsOptions.getState();

    this.permissionsService.getEditPermissions(this.project.$key)
        .subscribe(editPermissions => this.editPermissions = editPermissions);

    this.requestsService.getProjectRequests(this.project.$key)
        .subscribe(requests => this.requests = requests);
  }

  ngOnDestroy() {
    this.headerService.toolbarOutlet = null;
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
