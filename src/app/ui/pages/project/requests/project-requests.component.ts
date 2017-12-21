import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Project} from 'app/model/project';
import {RequestsService} from 'app/service/requests.service';
import {ProjectsService} from 'app/service/projects.service';
import {MediaQueryService} from 'app/service/media-query.service';
import {SubheaderService} from 'app/service/subheader.service';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {RequestsListComponent} from 'app/ui/shared/requests-list/requests-list.component';
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
  latestScrollPosition = 0;
  requests: Request[] = [];

  @ViewChild('scrollableContent') scrollableContent: ElementRef;
  @ViewChild(RequestsListComponent) requestsListComponent: RequestsListComponent;

  constructor(private route: ActivatedRoute,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private mediaQuery: MediaQueryService,
              private permissionsService: PermissionsService,
              private subheaderService: SubheaderService) { }

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
      this.requestsListComponent.showRequest(response.key, this.scrollableContent);
    });

    // Delay the HTML so that the page first shows up with a background.
    // This is significant for mobile
    setTimeout(() => { this.delayedShow = true; }, 0);
  }

  checkSubheader() {
    let scrollPosition = this.scrollableContent.nativeElement.scrollTop;
    if (scrollPosition > 60 && scrollPosition > this.latestScrollPosition) {
      this.subheaderService.visibility(false);
    }

    if (scrollPosition < (this.latestScrollPosition - 60) ||
        scrollPosition < 100) {
      this.subheaderService.visibility(true);
      this.latestScrollPosition = scrollPosition;
    }

    if (scrollPosition > this.latestScrollPosition) {
      this.latestScrollPosition = scrollPosition;
    }
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
