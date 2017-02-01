import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {FirebaseObjectObservable} from 'angularfire2';
import {Project} from '../../../../model/project';
import {RequestsService} from '../../../../service/requests.service';
import {ProjectsService} from '../../../../service/projects.service';
import {MediaQueryService} from '../../../../service/media-query.service';
import {SubheaderService} from '../../../../service/subheader.service';
import {PermissionsService, EditPermissions} from '../../../../service/permissions.service';
import {RequestsListComponent} from '../../../shared/requests-list/requests-list.component';

@Component({
  selector: 'project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.scss'],
})
export class ProjectRequestsComponent implements OnInit {
  delayedShow: boolean;
  editPermissions: EditPermissions;
  project: FirebaseObjectObservable<Project>;
  projectId: string;
  latestScrollPosition = 0;

  requestsCount: number = null;

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
      this.project = this.projectsService.getProject(this.projectId);

      this.permissionsService.getEditPermissions(this.projectId)
          .subscribe(editPermissions => { this.editPermissions = editPermissions; });

      this.requestsService.getProjectRequests(this.projectId)
          .subscribe(requests => { this.requestsCount = requests.length; });
    });

    this.requestsService.getRequestAddedStream().subscribe(response => {
      this.requestsListComponent.showRequest(response.key, this.scrollableContent);
    });

    // Delay the HTML so that the page first shows up with a background.
    // This is significant for mobile
    setTimeout(() => { this.delayedShow = true }, 0);
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
    return this.requestsService.getSelectedRequests().size > 0;
  }

  showBudget(): boolean {
    return this.editPermissions.requests;
  }
}
