import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {SeasonsDao} from 'app/service/seasons-dao';
import {isValidLogin} from 'app/utility/valid-login';
import {auth} from 'firebase/app';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {sendEvent} from 'app/utility/analytics';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'theme-background',
  }
})
export class Login implements OnDestroy {
  checkingAuth = new BehaviorSubject<boolean>(true);

  private destroyed = new Subject();

  constructor(private afAuth: AngularFireAuth,
              private seasonsDao: SeasonsDao,
              private snackBar: MatSnackBar,
              private route: Router) {
    this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(auth => {
      if (!auth) {
        this.checkingAuth.next(false);
        return;
      }

      if (auth && !isValidLogin(auth.email)) {
        sendEvent('login', 'invalid');
        this.snackBar.open(
            `Cannot log in as ${auth.email}, must login with a @beautifulday.org account`);
        this.afAuth.auth.signOut();
        this.checkingAuth.next(false);
        return;
      }

      sendEvent('login', 'valid');
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
