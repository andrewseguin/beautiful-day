import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProjectsService} from 'app/service/projects.service';
import {Request} from 'app/model/request';
import {Event} from 'app/model/event';
import {Project} from 'app/model/project';
import {MatDialog} from '@angular/material';
import {
  EditProjectComponent,
  EditType
} from 'app/ui/pages/shared/dialog/edit-project/edit-project.component';
import {DeleteProjectComponent} from 'app/ui/pages/shared/dialog/delete-project/delete-project.component';
import {EditProjectPermissions, PermissionsService} from 'app/service/permissions.service';
import {EventsService} from 'app/service/events.service';
import {AccountingService, BudgetResponse} from 'app/service/accounting.service';
import {Subscription} from 'rxjs/Subscription';
import {RequestsService} from 'app/service/requests.service';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  animations: [
    trigger('loadTrigger', [
      state('loaded', style({opacity: 1, transform: 'translate3d(0, 0, 0)'})),
      state('void, loading', style({opacity: 0, transform: 'translate3d(0, 3%, 0)'})),
      transition('* <=> loaded', [
        style({opacity: 0, transform: 'translate3d(0, 3%, 0)'}),
        animate('500ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ],
  host: {
    '[@loadTrigger]': "project && delayedShow ? 'loaded' : 'loading'"
  }
})
export class ProjectDetailsComponent implements OnInit {
  delayedShow: boolean;
  editPermissions: EditProjectPermissions;
  project: Project;
  requests: Request[];
  leads: string[];
  directors: string[];
  acquisitions: string;
  events: Event[];
  canEdit = false;

  noBudget: boolean;
  budgetStream: BudgetResponse;

  // Init subscriptions
  upcomingEventsSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mdDialog: MatDialog,
              private permissionsService: PermissionsService,
              private eventsService: EventsService,
              private accountingService: AccountingService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.route.parent.params.forEach((params: Params) => {
      const projectId = params['id'];

      this.projectsService.get(projectId).subscribe((project: Project) => {
        this.project = project;

        this.requestsService.getProjectRequests(projectId)
            .subscribe(requests => this.requests = requests);

        this.permissionsService.getEditPermissions(projectId)
            .subscribe(editPermissions => this.canEdit = editPermissions.requests);

        this.accountingService.getBudgetStream(projectId)
            .subscribe(budgetResponse => {
              this.noBudget = budgetResponse.budget === undefined;
              this.budgetStream = budgetResponse;
            });
      });
    });

    this.upcomingEventsSubscription = this.eventsService.getUpcomingEvents()
        .subscribe(events => this.events = events);

    // Delay the HTML so that the page first shows up with a background.
    // This is significant for mobile
    setTimeout(() => { this.delayedShow = true; }, 0);
  }

  ngOnDestroy() {
    this.upcomingEventsSubscription.unsubscribe();
  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    dialogRef.componentInstance.project = this.project;
    dialogRef.componentInstance.type = type;
  }

  getLeadEmails(): string[] {
    return this.project.leads ? this.project.leads.split(',') : [];
  }

  getDirectorEmails(): string[] {
    return this.project.directors ? this.project.directors.split(',') : [];
  }

  deleteProject() {
    const dialogRef = this.mdDialog.open(DeleteProjectComponent);
    dialogRef.componentInstance.project = this.project;
  }

  navigateToDates() {
    this.router.navigateByUrl('events');
  }

  getApprovedRequests() {
    return this.requests ? this.requests.filter(request => request.isApproved) : [];
  }

  getPurchasedRequests() {
    return this.requests ? this.requests.filter(request => request.isPurchased) : [];
  }

  printRequests() {
    window.open(`print/project/${this.project.$key}`, 'print', 'width=650, height=500');
  }
}
