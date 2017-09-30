import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HeaderService} from '../../../service/header.service';
import {MediaQueryService} from '../../../service/media-query.service';
import {SubheaderService} from '../../../service/subheader.service';
import {ActivatedRoute, Event, Router, UrlSegment} from '@angular/router';
import {TopLevelSection} from '../../../router.config';
import {ProjectsService} from '../../../service/projects.service';
import {Project} from '../../../model/project';
import {MatDialog, MatSidenav} from '@angular/material';
import {UsersService} from '../../../service/users.service';
import {User} from '../../../model/user';
import {EditUserProfileComponent} from '../dialog/edit-user-profile/edit-user-profile.component';
import {PromptDialogComponent} from '../dialog/prompt-dialog/prompt-dialog.component';
import {FeedbackService} from '../../../service/feedback.service';
import {EditGroupComponent} from '../dialog/edit-group/edit-group.component';
import {PermissionsService} from '../../../service/permissions.service';
import {ImportItemsComponent} from '../dialog/import-items/import-items.component';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('subheader', [
      state('visible', style({transform: 'translate3d(0, 0, 0)'})),
      state('hidden', style({transform: 'translate3d(0, -100%, 0)'})),
      transition('visible <=> hidden', [
        animate('350ms cubic-bezier(0.35, 0, 0.25, 1)')]
      ),
    ])
  ]
})
export class HeaderComponent implements OnInit {
  topLevel: TopLevelSection;
  authState: firebase.User;
  user: User;
  project: Project;

  subheaderVisibility: 'visible'|'hidden' = 'visible';

  canManageAcqusitionsTeam: boolean;
  canManageApproversTeam: boolean;
  canManageAdmins: boolean;
  canImportItems: boolean;

  @Input() sidenav: MatSidenav;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private mediaQuery: MediaQueryService,
    private subheaderService: SubheaderService,
    private mdDialog: MatDialog,
    private feedbackService: FeedbackService,
    private permissionsService: PermissionsService,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
      if (this.authState) {
        this.usersService.get(authState.email).subscribe(user => {
          this.user = user;
        });
      }
    });

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      this.subheaderVisibility = visibility ? 'visible' : 'hidden';
    });

    this.router.events.subscribe((event: Event) => {
      if (this.route.firstChild) {
        this.handleRouteChange(this.route.firstChild);
      }
    });

    this.permissionsService.canManageAdmins()
      .subscribe(canManageAdmins => {
        this.canManageAdmins = canManageAdmins;
        this.canManageApproversTeam = canManageAdmins;
      });

    this.permissionsService.canManageAcqusitionsTeam()
      .subscribe(canManageAcquisitionsTeam => this.canManageAcqusitionsTeam = canManageAcquisitionsTeam);

    this.permissionsService.canImportItems()
      .subscribe(canImportItems => this.canImportItems = canImportItems);
  }

  handleRouteChange(route: ActivatedRoute) {
    route.url.take(1).subscribe((url: UrlSegment[]) => {
      this.topLevel = <TopLevelSection>url[0].path;

      this.project = null;
      if (this.topLevel === 'project') {
        this.headerService.title = 'Loading...';
        this.projectsService.getProject(url[1].path).subscribe(project => {
          this.project = project;
          if (project.$exists()) {
            this.headerService.title = project.name;
          } else {
            this.headerService.title = '';
          }
        });
      }
    });
  }

  getTitle(): string {
    return this.headerService.title;
  }

  isMobile(): boolean {
    return this.mediaQuery.isMobile();
  }

  logout(): void {
    this.afAuth.auth.signOut();

    const logoutUrl = 'https://www.google.com/accounts/Logout';
    const googleContinue = 'https://appengine.google.com/_ah/logout';
    window.location.href =
        `${logoutUrl}?continue=${googleContinue}?continue=${window.location.href}`;
  }

  editProfile(): void {
    const dialogRef = this.mdDialog.open(EditUserProfileComponent);
    dialogRef.componentInstance.user = this.user;
  }

  manageAdmins(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'admins';
  }

  manageAcquisitions(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'acquisitions';
  }

  manageApprovers(): void {
    const dialogRef = this.mdDialog.open(EditGroupComponent);
    dialogRef.componentInstance.group = 'approvers';
  }

  sendFeedback(): void {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Send Feedback';
    dialogRef.componentInstance.useTextArea = true;
    dialogRef.componentInstance.onSave().subscribe(text => {
      this.feedbackService.addFeedback(text);
    });
  }

  reportIssue(): void {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Report Issue';
    dialogRef.componentInstance.useTextArea = true;
    dialogRef.componentInstance.onSave().subscribe(text => {
      this.feedbackService.addIssue(text);
    });
  }

  importItems(): void {
    this.mdDialog.open(ImportItemsComponent);
  }
}
