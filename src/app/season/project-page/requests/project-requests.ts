import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {RequestsList} from 'app/season/shared/requests-list/requests-list';
import {
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/season/services/requests-renderer/request-renderer-options';
import {isMobile} from 'app/utility/media-matcher';
import {Header} from 'app/season/services/header';
import {CdkPortal} from '@angular/cdk/portal';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedSeason, Selection} from 'app/season/services';
import {Project, Request, RequestsDao} from 'app/season/dao';
import {InputQuery} from 'app/season/services/requests-renderer/query';

@Component({
  selector: 'project-requests',
  templateUrl: 'project-requests.html',
  styleUrls: ['project-requests.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectRequests implements OnInit {
  requests: Request[];
  initialOptionsState: RequestRendererOptionsState;
  currentOptionsState: RequestRendererOptionsState;

  isLoading: boolean;
  hasRequests: boolean;
  canEdit: boolean;

  @Input() project: Project;

  @ViewChild(RequestsList) requestsListComponent: RequestsList;
  @ViewChild(CdkPortal) toolbarActions: CdkPortal;

  private destroyed = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private activatedSeason: ActivatedSeason,
              private router: Router,
              private header: Header,
              private requestsDao: RequestsDao,
              private selection: Selection,
              private cd: ChangeDetectorRef,
              private permissions: Permissions) {}

  ngOnInit() {
    this.header.toolbarOutlet.next(this.toolbarActions);

    const renderRequestsOptions = new RequestRendererOptions();
    renderRequestsOptions.filters = [{
      type: 'projectKey',
      query: { input: this.project.id, equality: 'is' },
      isImplicit: true
    }];
    this.initialOptionsState = renderRequestsOptions.getState();
    this.currentOptionsState = this.initialOptionsState;

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
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
    this.destroyed.next();
    this.destroyed.complete();
  }

  hideInventory(): boolean {
    return isMobile() || !this.canEdit;
  }

  hasSelectedRequests(): boolean {
    return this.selection.requests.selected.length > 0;
  }

  print() {
    this.router.navigate([`${this.activatedSeason.season.value}/print`, {
      options: JSON.stringify(this.currentOptionsState),
      title: this.project.name
    }]);
  }
}
