import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {MatDialog, MatSidenav} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AngularFireAuth} from '@angular/fire/auth';
import {EditUserProfile} from '../dialog/user/edit-user-profile/edit-user-profile';
import {map, mergeMap, take, takeUntil} from 'rxjs/operators';
import {UsersDao} from 'app/service/users-dao';
import {FormControl} from '@angular/forms';
import {Observable, of, Subject} from 'rxjs';
import {SeasonsDao} from 'app/service/seasons-dao';
import {UserDialog} from 'app/season/shared/dialog/user/user-dialog';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

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
  animations: [
    trigger('userSection', [
      state('void, true', style({ height: '*' })),
      state('false',   style({ height: '64px' })),
      transition('* => *', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, true',   style({ transform: 'rotate(0deg)' })),
      state('false',   style({ transform: 'rotate(180deg)' })),
      transition('* => *', animate(ANIMATION_DURATION)),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Nav {
  user = this.afAuth.authState.pipe(
      mergeMap(auth => auth ? this.usersDao.get(auth.uid) : of(null)));
  isUserProfileExpanded = false;
  hasMissingUserProfileInfo = this.afAuth.authState.pipe(
      mergeMap(authState => this.usersDao.get(authState.uid)),
      map(user => user ? (!user.name || !user.phone) : false));

  seasons = this.seasonsDao.list.pipe(map(v => v ? v.map(s => s.id) : []));
  season = new FormControl('');

  isDarkTheme = false;

  links: NavLink[] = [
    {route: 'projects', label: 'Projects', icon: 'domain'},
    {route: 'events', label: 'Events', icon: 'event'},
    {
      route: 'inventory', label: 'Inventory', icon: 'shopping_cart',
      permissions: this.permissions.isAcquisitions
    },
    {route: 'reports', label: 'Reports', icon: 'assignment',
      permissions: this.permissions.isAcquisitions},
    {route: 'admin', label: 'Admin', icon: 'build',
      permissions: this.permissions.isAdmin},
    {route: 'help', label: 'Help', icon: 'help'},
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
              public router: Router) {
    this.activatedRoute.params.pipe(
        takeUntil(this.destroyed))
        .subscribe(params => this.season.setValue(params['season'], {emitEvent: false}));

    this.season.valueChanges.pipe(
      takeUntil(this.destroyed))
      .subscribe(value => this.router.navigate([value, this.router.url.split('/')[2]]));

    this.hasMissingUserProfileInfo.subscribe(value => {
      if (value) {
        this.isUserProfileExpanded = true;
        this.cd.markForCheck();
      }
    });

    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  nagivateToHome() {
    this.router.navigate(['projects'], {relativeTo: this.activatedRoute});
    this.sidenav.close();
  }

  editProfile() {
    this.afAuth.authState.pipe(
        mergeMap(auth => this.usersDao.get(auth.uid)),
        take(1))
        .subscribe(user => {
          this.userDialog.editProfile(user);
        });
  }

  toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }
}
