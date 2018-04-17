import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkingAuth = true;

  constructor(private afAuth: AngularFireAuth,
              private route: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.checkingAuth = false;
        return;
      }

      // Navigate out of login.
      let locationHash = window.location.hash.substr(1);
      this.route.navigate([locationHash || '']);
    });
  }

  login() {
    this.checkingAuth = true;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
