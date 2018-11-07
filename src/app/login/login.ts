import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SeasonsDao} from 'app/service/seasons-dao';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login implements OnDestroy {
  checkingAuth = true;

  private destroyed = new Subject();

  constructor(private afAuth: AngularFireAuth,
              private cd: ChangeDetectorRef,
              private seasonsDao: SeasonsDao,
              private route: Router) {
    this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(auth => {
      if (auth) {
        let locationHash = window.location.hash.substr(1);

        if (locationHash) {
          this.route.navigate([locationHash]);
        } else {
          this.seasonsDao.list.pipe(takeUntil(this.destroyed)).subscribe(seasons => {
            if (!seasons) {
              return;
            }

            this.route.navigate([seasons[seasons.length - 1].id]);
          });
        }
      } else {
        // Show button
        this.checkingAuth = false;
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  login() {
    this.checkingAuth = true;
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    this.cd.markForCheck();
  }
}
