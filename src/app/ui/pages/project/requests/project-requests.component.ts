import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'app/model/project';
import {PermissionsService} from 'app/service/permissions.service';
import {RequestsListComponent} from 'app/ui/pages/shared/requests-list/requests-list.component';
import {Request} from 'app/model/request';
import {
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {isMobile} from 'app/utility/media-matcher';
import {HeaderService} from 'app/service/header.service';
import {CdkPortal} from '@angular/cdk/portal';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Selection} from 'app/service';
import {RequestsDao} from 'app/service/dao';

@Component({
  selector: 'project-requests',
  templateUrl: 'project-requests.component.html',
  styleUrls: ['project-requests.component.scss'],
})
export class ProjectRequestsComponent implements OnInit {
  requests: Request[];
  renderRequestsOptionsState: RequestRendererOptionsState;

  isLoading: boolean;
  hasRequests: boolean;
  canEdit: boolean;

  @Input() project: Project;

  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;
  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  constructor(private route: ActivatedRoute,
              private headerService: HeaderService,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private permissionsService: PermissionsService) {}

  ngOnInit() {
    this.headerService.toolbarOutlet = this.toolbarActions;

    const renderRequestsOptions = new RequestRendererOptions();
    renderRequestsOptions.filters = [{
      type: 'projectKey',
      query: { key: this.project.id },
      isImplicit: true
    }];
    this.renderRequestsOptionsState = renderRequestsOptions.getState();

    const changes = [
      this.requestsDao.list,
      this.permissionsService.editableProjects,
    ];

    this.isLoading = true;
    combineLatest(changes).pipe(takeUntil(this.destroyed)).subscribe(result => {
      const requests: Request[] = result[0];
      const editableProjects: Set<string> = result[1];

      if (!requests || !editableProjects) {
        return;
      }

      this.hasRequests = requests.some(r => r.project === this.project.id);
      this.canEdit = editableProjects.has(this.project.id);
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.headerService.toolbarOutlet = null;
    this.destroyed.next();
    this.destroyed.complete();
  }

  hideInventory(): boolean {
    return isMobile() || !this.canEdit;
  }

  hasSelectedRequests(): boolean {
    return this.selection.requests.selected.length > 0;
  }
}
