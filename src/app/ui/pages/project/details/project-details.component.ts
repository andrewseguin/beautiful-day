import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProjectsService} from '../../../../service/projects.service';
import {Request} from '../../../../model/request';
import {Event} from '../../../../model/event';
import {Project} from '../../../../model/project';
import {MatDialog} from '@angular/material';
import {
  EditProjectComponent,
  EditType
} from '../../../shared/dialog/edit-project/edit-project.component';
import {DeleteProjectComponent} from '../../../shared/dialog/delete-project/delete-project.component';
import {EditPermissions, PermissionsService} from '../../../../service/permissions.service';
import {EventsService} from '../../../../service/events.service';
import {AccountingService, BudgetResponse} from '../../../../service/accounting.service';
import {Subscription} from 'rxjs';
import {RequestsService} from '../../../../service/requests.service';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {transformSnapshotAction} from '../../../../utility/snapshot-tranform';

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
  editPermissions: EditPermissions;
  project: Project;
  requests: Request[];
  user: firebase.User;
  leads: string[];
  directors: string[];
  acquisitions: string;
  events: Event[];

  noBudget: boolean;
  budgetStream: BudgetResponse;
  remainingBudget: number;

  // Init subscriptions
  authSubscription: Subscription;
  upcomingEventsSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private mdDialog: MatDialog,
              private auth: AngularFireAuth,
              private permissionsService: PermissionsService,
              private eventsService: EventsService,
              private accountingService: AccountingService,
              private requestsService: RequestsService,
              private projectsService: ProjectsService) { }

  ngOnInit() {
    this.authSubscription = this.auth.authState.subscribe(auth => {
      this.user = auth;
    });

    this.route.parent.params.forEach((params: Params) => {
      this.projectsService.getProject(params['id']).subscribe((project: Project) => {
        this.project = project;

        this.requestsService.getProjectRequests(params['id'])
            .subscribe(requests => this.requests = requests);

        this.permissionsService.getEditPermissions(params['id'])
            .subscribe(editPermissions => this.editPermissions = editPermissions);

        this.accountingService.getBudgetStream(params['id'])
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
    this.authSubscription.unsubscribe();
    this.upcomingEventsSubscription.unsubscribe();
  }

  edit(type: EditType) {
    const dialogRef = this.mdDialog.open(EditProjectComponent);
    dialogRef.componentInstance.project = this.project;
    dialogRef.componentInstance.type = type;
  }

  canEdit(): boolean {
    if (!this.user || !this.project || !this.editPermissions) { return false; }
    return this.editPermissions.requests;
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
