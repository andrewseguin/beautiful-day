import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {Subscription} from 'rxjs/Subscription';
import {auth} from 'firebase/app';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  checkingAuth = true;
  authStateSubscription: Subscription;

  constructor(private afAuth: AngularFireAuth,
              private route: Router) {
    this.authStateSubscription = this.afAuth.authState.subscribe(auth => {
      this.checkingAuth = false;
      if (auth) {
        let locationHash = window.location.hash.substr(1);
        this.route.navigate([locationHash || '']);
      }
    });
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }

  login() {
    this.checkingAuth = true;
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
}
