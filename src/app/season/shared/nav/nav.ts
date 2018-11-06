import {Component, Input} from '@angular/core';
import {MatDialog, MatSidenav} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {Permissions} from 'app/season/services/permissions';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AngularFireAuth} from '@angular/fire/auth';
import {EditUserProfile} from '../dialog/edit-user-profile/edit-user-profile';
import {mergeMap, takeUntil} from 'rxjs/operators';
import {UsersDao} from 'app/service/users-dao';
import {FormControl} from '@angular/forms';
import {of, Subject} from 'rxjs';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

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
  ]
})
export class Nav {
  user = this.afAuth.authState.pipe(
      mergeMap(auth => auth ? this.usersDao.getByEmail(auth.email) : of(null)));
  isUserProfileExpanded = false;

  seasons = ['2017', '2018'];
  season = new FormControl('');

  @Input() sidenav: MatSidenav;

  private destroyed = new Subject();

  constructor(public permissions: Permissions,
              public afAuth: AngularFireAuth,
              public dialog: MatDialog,
              public usersDao: UsersDao,
              public activatedRoute: ActivatedRoute,
              public router: Router) {
    this.activatedRoute.params.pipe(
        takeUntil(this.destroyed))
        .subscribe(params => this.season.setValue(params['season'], {emitEvent: false}));

    this.season.valueChanges.pipe(
      takeUntil(this.destroyed))
      .subscribe(value => this.router.navigate([value, this.router.url.split('/')[2]]));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  nagivateToHome() {
    this.router.navigate(['projects'], {relativeTo: this.activatedRoute});
    this.sidenav.close();
  }

  editProfile(): void {
    this.dialog.open(EditUserProfile);
  }
}
