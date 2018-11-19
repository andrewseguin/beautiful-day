import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Header} from 'app/season/services/header';
import {MatSidenav} from '@angular/material';
import {map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {UsersDao} from 'app/service/users-dao';

@Component({
  selector: 'season-header',
  templateUrl: 'season-header.html',
  styleUrls: ['season-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeasonHeader {
  needsProfileInfo = this.afAuth.authState.pipe(
      mergeMap(auth => auth ? this.usersDao.get(auth.uid) : of(null)),
      map(user => user ? (!user.name || !user.phone) : false));

  @Input() sidenav: MatSidenav;

  constructor(public header: Header,
              private afAuth: AngularFireAuth,
              private usersDao: UsersDao,
              private cd: ChangeDetectorRef) { }

  leftButtonClicked() {
    if (this.header.goBack) {
      this.header.goBack();
    } else {
      this.sidenav.open();
    }
  }

  check() {
    this.cd.markForCheck();
  }
}
