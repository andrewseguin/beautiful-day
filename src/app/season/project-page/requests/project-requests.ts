import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {RequestsList} from 'app/season/shared/requests-list/requests-list';
import {
  RequestRendererOptions,
  RequestRendererOptionsState
} from 'app/season/services/requests-renderer/request-renderer-options';
import {mobileMatch} from 'app/utility/media-matcher';
import {Header} from 'app/season/services/header';
import {CdkPortal} from '@angular/cdk/portal';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {ActivatedSeason, Selection} from 'app/season/services';
import {Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {containsEmail} from '../../utility/contains-email';
import {BreakpointObserver} from '@angular/cdk/layout';

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
  hasRequests: Observable<boolean>;
  canEdit: Observable<boolean>;

  isDirector = combineLatest(
    [this.projectsDao.list.pipe(map(list => list ? list : [])),
    this.afAuth.user.pipe(map(user => user ? user.email : ''))],
  ).pipe(map(([projects, email]) => {
    return projects.some(p => containsEmail(p.directors, email));
  }));

  @Input() project: Project;

  @ViewChild(RequestsList, { static: false }) requestsListComponent: RequestsList;
  @ViewChild(CdkPortal, { static: true }) toolbarActions: CdkPortal;

  isMobile = this.breakpointObserver.observe(mobileMatch);

  constructor(private activatedRoute: ActivatedRoute,
              private activatedSeason: ActivatedSeason,
              private router: Router,
              private header: Header,
              private requestsDao: RequestsDao,
              private projectsDao: ProjectsDao,
              private selection: Selection,
              private breakpointObserver: BreakpointObserver,
              private cd: ChangeDetectorRef,
              private permissions: Permissions,
              private afAuth: AngularFireAuth) {}

  ngOnInit() {
    this.hasRequests = this.requestsDao.list.pipe(
      tap(() => this.isLoading = true),
      map(requests => requests.some(r => r.project === this.project.id)),
      tap(() => this.isLoading = false));

    this.canEdit = this.permissions.editableProjects.pipe(
      filter(e => !!e),
      map(e => e.has(this.project.id)));

    this.header.toolbarOutlet.next(this.toolbarActions);

    const renderRequestsOptions = new RequestRendererOptions();
    renderRequestsOptions.filters = [{
      type: 'projectKey',
      query: { input: this.project.id, equality: 'is' },
      isImplicit: true
    }];
    this.initialOptionsState = renderRequestsOptions.getState();
    this.currentOptionsState = this.initialOptionsState;
  }

  ngOnDestroy() {
    this.header.toolbarOutlet.next(null);
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

  navigateToReceiptFolder() {
    window.open(this.project.receiptsFolder);
  }
}
