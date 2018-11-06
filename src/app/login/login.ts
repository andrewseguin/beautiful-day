import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
export class Login implements OnDestroy {
  checkingAuth = true;

  private destroyed = new Subject();

  constructor(private afAuth: AngularFireAuth,
              private route: Router) {
    this.afAuth.authState.pipe(takeUntil(this.destroyed)).subscribe(auth => {
      this.checkingAuth = false;
      if (auth) {
        let locationHash = window.location.hash.substr(1);
        this.route.navigate([locationHash || '']);
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
  }
}
