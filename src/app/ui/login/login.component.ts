import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from 'app/service/users.service';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {take} from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkingAuth = true;

  constructor(private afAuth: AngularFireAuth,
              private usersService: UsersService,
              private route: Router) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.checkingAuth = false;
        return;
      }

      this.usersService.getByEmail(auth.email).pipe(take(1)).subscribe(user => {
        if (!user) { this.usersService.create(auth); }

        // Navigate out of login.
        let locationHash = window.location.hash.substr(1);
        this.route.navigate([locationHash || '']);
      });
    });
  }

  login() {
    this.checkingAuth = true;
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
