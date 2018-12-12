import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SeasonsDao} from 'app/service/seasons-dao';
import {MatSnackBar} from '@angular/material';
import {UsersDao} from 'app/service/users-dao';
import {isValidLogin} from 'app/utility/valid-login';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login implements OnDestroy {
  checkingAuth = new BehaviorSubject<boolean>(true);

  private destroyed = new Subject();

  constructor(private afAuth: AngularFireAuth,
              private cd: ChangeDetectorRef,
              private seasonsDao: SeasonsDao,
              private usersDao: UsersDao,
              private snackBar: MatSnackBar,
              private route: Router) {
    this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(auth => {
      if (!auth) {
        this.checkingAuth.next(false);
        return;
      }

      if (auth && !isValidLogin(auth.email)) {
        this.snackBar.open('Must login with a @beautifulday.org account');
        this.afAuth.auth.signOut();
        this.checkingAuth.next(false);
        return;
      }

      let hash = window.location.hash.substr(1);
      if (hash) {
        this.route.navigate([hash]);
      } else {
        this.seasonsDao.list.pipe(
            takeUntil(this.destroyed))
            .subscribe(seasons => {
              if (seasons) {
                this.route.navigate([seasons[seasons.length - 1].id]);
              }
            });
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  login() {
    this.checkingAuth.next(true);
    const googleAuthProvider = new auth.GoogleAuthProvider();
    googleAuthProvider.setCustomParameters({
      prompt: 'select_account'
    });
    this.afAuth.auth.signInWithPopup(googleAuthProvider);
  }
}
