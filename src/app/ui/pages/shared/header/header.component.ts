import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {TitleService} from 'app/service/header.service';
import {MediaQueryService} from 'app/service/media-query.service';
import {ActivatedRoute, Event, NavigationEnd, Router, UrlSegment} from '@angular/router';
import {TopLevelSection} from 'app/ui/pages/pages.routes';
import {MatDialog, MatSidenav} from '@angular/material';
import {UsersService} from 'app/service/users.service';
import {User} from 'app/model/user';
import {EditUserProfileComponent} from '../dialog/edit-user-profile/edit-user-profile.component';
import {PromptDialogComponent} from '../dialog/prompt-dialog/prompt-dialog.component';
import {FeedbackService} from 'app/service/feedback.service';
import {EditGroupComponent} from '../dialog/edit-group/edit-group.component';
import {PermissionsService} from 'app/service/permissions.service';
import {ImportItemsComponent} from '../dialog/import-items/import-items.component';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase';
import {take} from 'rxjs/operators';
import {ExportItemsComponent} from 'app/ui/pages/shared/dialog/export-items/export-items.component';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  topLevel: TopLevelSection;
  authState: firebase.User;
  user: User;
  projectId = '';

  canManageAcqusitionsTeam: boolean;
  canManageApproversTeam: boolean;
  canManageAdmins: boolean;
  canImportItems: boolean;

  showPrintIcon: boolean;

  @Input() sidenav: MatSidenav;

  constructor(
    public titleService: TitleService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private mediaQuery: MediaQueryService,
    private mdDialog: MatDialog,
    private feedbackService: FeedbackService,
    private permissionsService: PermissionsService) { }

  @ViewChildren('exportItems') exportItemsLink: QueryList<ElementRef>;

  ngOnInit() {
    this.afAuth.authState.subscribe(authState => {
      this.authState = authState;
      if (this.authState) {
        this.usersService.getByEmail(authState.email).subscribe(user => {
          this.user = user;
        });
      }
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

    this.permissionsService.canManageAcquisitionsTeam().subscribe(canManageAcquisitionsTeam => {
      this.canManageAcqusitionsTeam = canManageAcquisitionsTeam;
    });

    this.permissionsService.canImportItems()
      .subscribe(canImportItems => this.canImportItems = canImportItems);
  }

  printRequests() {
    window.open(`print/project/${this.projectId}`, 'print', 'width=650, height=500');
  }

  handleRouteChange(route: ActivatedRoute) {
    route.url.pipe(take(1)).subscribe((url: UrlSegment[]) => {
      this.topLevel = <TopLevelSection>url[0].path;
      if (this.topLevel !== 'project') {
        this.projectId = '';
        return;
      }

      const urlTokens = window.location.pathname.split('/');
      this.showPrintIcon = urlTokens[3] === 'requests';

      this.projectId = url[1].path;
    });
  }

  isMobile(): boolean {
    return this.mediaQuery.isMobile();
  }
}
