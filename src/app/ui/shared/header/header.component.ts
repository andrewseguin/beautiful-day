import {Component, Input, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HeaderService} from 'app/service/header.service';
import {MediaQueryService} from 'app/service/media-query.service';
import {SubheaderService} from 'app/service/subheader.service';
import {ActivatedRoute, Event, NavigationEnd, Router, UrlSegment} from '@angular/router';
import {TopLevelSection} from 'app/router.config';
import {ProjectsService} from 'app/service/projects.service';
import {MatDialog, MatSidenav} from '@angular/material';
import {UsersService} from 'app/service/users.service';
import {User} from 'app/model/user';
import {EditUserProfileComponent} from '../dialog/edit-user-profile/edit-user-profile.component';
import {PromptDialogComponent} from '../dialog/prompt-dialog/prompt-dialog.component';
import {FeedbackService} from 'app/service/feedback.service';
import {EditGroupComponent} from '../dialog/edit-group/edit-group.component';
import {PermissionsService} from 'app/service/permissions.service';
import {ImportItemsComponent} from '../dialog/import-items/import-items.component';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {take} from 'rxjs/operators';

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
  projectId = '';

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
        this.usersService.getByEmail(authState.email).subscribe(user => {
          this.user = user;
        });
      }
    });

    this.subheaderService.visibilitySubject.subscribe(visibility => {
      this.subheaderVisibility = visibility ? 'visible' : 'hidden';
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange(this.route.firstChild);
      }
    });
    this.handleRouteChange(this.route.firstChild);

    this.permissionsService.canManageAdmins()
      .subscribe(canManageAdmins => {
        this.canManageAdmins = canManageAdmins;
        this.canManageApproversTeam = canManageAdmins;
      });

    this.permissionsService.canManageAcquisitionsTeam()
      .subscribe(canManageAcquisitionsTeam => this.canManageAcqusitionsTeam = canManageAcquisitionsTeam);

    this.permissionsService.canImportItems()
      .subscribe(canImportItems => this.canImportItems = canImportItems);
  }

  handleRouteChange(route: ActivatedRoute) {
    route.url.pipe(take(1)).subscribe((url: UrlSegment[]) => {
      this.topLevel = <TopLevelSection>url[0].path;
      if (this.topLevel !== 'project') {
        this.projectId = '';
        return;
      }

      const projectId = url[1].path;
      if (this.projectId !== projectId) {
        this.loadProjectTitle(projectId);
      }
    });
  }

  loadProjectTitle(projectId: string) {
    this.projectId = projectId;
    this.headerService.title = 'Loading...';
    this.projectsService.get(projectId).subscribe(project => {
      this.projectId = project.$key;
      this.headerService.title = project ? project.name : '';
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
      this.feedbackService.addFeedback('feedback', <string>text);
    });
  }

  reportIssue(): void {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Report Issue';
    dialogRef.componentInstance.useTextArea = true;
    dialogRef.componentInstance.onSave().subscribe(text => {
      this.feedbackService.addFeedback('issue', <string>text);
    });
  }

  importItems(): void {
    this.mdDialog.open(ImportItemsComponent);
  }
}
