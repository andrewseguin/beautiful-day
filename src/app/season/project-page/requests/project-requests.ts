import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {RequestsList} from 'app/season/shared/requests-list/requests-list';
import {
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/season/shared/requests-list/render/request-renderer-options';
import {isMobile} from 'app/utility/media-matcher';
import {Header} from 'app/season/services/header';
import {CdkPortal} from '@angular/cdk/portal';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Selection} from 'app/season/services';
import {Request, Project, RequestsDao} from 'app/season/dao';

@Component({
  selector: 'project-requests',
  templateUrl: 'project-requests.html',
  styleUrls: ['project-requests.scss'],
})
export class ProjectRequests implements OnInit {
  requests: Request[];
  renderRequestsOptionsState: RequestRendererOptionsState;

  isLoading: boolean;
  hasRequests: boolean;
  canEdit: boolean;

  @Input() project: Project;

  @ViewChild(RequestsList) requestsListComponent: RequestsList;
  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private header: Header,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private permissions: Permissions) {}

  ngOnInit() {
    this.header.toolbarOutlet = this.toolbarActions;

    const renderRequestsOptions = new RequestRendererOptions();
    renderRequestsOptions.filters = [{
      type: 'projectKey',
      query: { key: this.project.id },
      isImplicit: true
    }];
    this.renderRequestsOptionsState = renderRequestsOptions.getState();

    const changes = [
      this.requestsDao.list,
      this.permissions.editableProjects,
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
    this.header.toolbarOutlet = null;
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
