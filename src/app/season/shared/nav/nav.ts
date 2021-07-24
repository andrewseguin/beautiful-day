import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import {ActivatedRoute, Router} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter, map, mergeMap, take, takeUntil} from 'rxjs/operators';
import {UsersDao} from 'app/service/users-dao';
import {FormControl} from '@angular/forms';
import {combineLatest, Observable, of, Subject} from 'rxjs';
import {Season, SeasonsDao} from 'app/service/seasons-dao';
import {UserDialog} from 'app/season/shared/dialog/user/user-dialog';
import {Theme} from 'app/season/services/theme';
import {ContactsDao, EventsDao, FaqsDao} from 'app/season/dao';
import {APP_VERSION} from 'app/app';
import {PromptDialog, PromptDialogResult} from '../dialog/prompt-dialog/prompt-dialog';
import {getMergedObjectValue} from '../../utility/merged-obj-value';
import {Group, GroupsDao} from '../../dao';

export interface NavLink {
  route: string;
  label: string;
  icon: string;
  permissions?: Observable<boolean>;
}

@Component({
  selector: 'nav-content',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav {
  version = APP_VERSION;

  user = this.afAuth.authState.pipe(
      filter(auth => !!auth),
      mergeMap(auth => this.usersDao.get(auth.uid)));
  isUserProfileExpanded = false;
  hasMissingUserProfileInfo = this.afAuth.authState.pipe(
      filter(auth => !!auth),
      mergeMap(auth => this.usersDao.get(auth.uid)),
      map(user => user ? (!user.name || !user.phone) : false));

  seasons = this.seasonsDao.list.pipe(map(v => v ? v.map(s => s.id) : []));
  season = new FormControl('');

  hasHelp = combineLatest([this.faqsDao.list, this.contactsDao.list]).pipe(
      map(result => {
        return !!(result[0] && result[0].length) ||
               !!(result[1] && result[1].length);
      }));

  links: NavLink[] = [
    {route: 'projects', label: 'Projects', icon: 'domain'},
    {route: 'events', label: 'Events', icon: 'event',
      permissions: this.eventsDao.list.pipe(map(e => !!(e && e.length)))
    },
    {
      route: 'inventory', label: 'Inventory', icon: 'shopping_cart',
      permissions: this.permissions.isAcquisitions
    },
    {
      route: 'allocation', label: 'Allocation', icon: 'ballot',
      permissions: this.permissions.isAcquisitions
    },
    {route: 'reports', label: 'Reports', icon: 'assignment',
      permissions: this.permissions.isAcquisitions},
    {route: 'admin', label: 'Admin', icon: 'build',
      permissions: this.permissions.isAdmin},
    {route: 'help', label: 'Help', icon: 'help',
      permissions: this.hasHelp},
  ];

  @Input() sidenav: MatSidenav;

  private destroyed = new Subject();

  constructor(public permissions: Permissions,
              public afAuth: AngularFireAuth,
              public dialog: MatDialog,
              public usersDao: UsersDao,
              public seasonsDao: SeasonsDao,
              public activatedRoute: ActivatedRoute,
              public userDialog: UserDialog,
              public cd: ChangeDetectorRef,
              public faqsDao: FaqsDao,
              public contactsDao: ContactsDao,
              public groupsDao: GroupsDao,
              public eventsDao: EventsDao,
              public theme: Theme,
              public router: Router) {
    this.activatedRoute.params.pipe(
        takeUntil(this.destroyed))
        .subscribe(params => this.season.setValue(params['season'], {emitEvent: false}));

    this.season.valueChanges.pipe(
      takeUntil(this.destroyed))
      .subscribe(value => {
        if (value === 'new') {
          this.openNewSeasonDialog();
          return;
        }

        this.router.navigate([value, this.router.url.split('/')[2]]);
        this.sidenav.close();
      });

    this.hasMissingUserProfileInfo.subscribe(value => {
      if (value) {
        this.isUserProfileExpanded = true;
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  editProfile() {
    this.afAuth.authState.pipe(
        mergeMap(auth => this.usersDao.get(auth.uid)),
        take(1))
        .subscribe(user => {
          this.userDialog.editProfile(user);
        });
  }

  private openNewSeasonDialog() {
    const dialogRef = this.dialog.open(PromptDialog, {
      width: '400px',
      data: {
        title: 'New Season',
        input: of(),
      }
    });
    dialogRef.afterClosed().pipe(take(1)).subscribe(async (result: PromptDialogResult) => {
      const id = result && `${result.value}`.trim();
      if (id) {
        await this.seasonsDao.add({
          id,
          name: id,
        });
        await this.router.navigate([`/${result.value}`]);
        await this.groupsDao.add({
          id: 'admins',
          users: [(await this.afAuth.currentUser).email]
        });
        await this.router.navigate([`/${result.value}/admin`]);
        this.sidenav.close();
      } else {
        window.location.reload();
      }
    });
  }
}
