import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from "angularfire2";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  checkingAuth: boolean = true;

  constructor(private auth: FirebaseAuth, private route: Router) { }

  ngOnInit() {
    this.auth.subscribe(auth => {
      this.checkingAuth = false;
      if (auth) {
        const locationHash = window.location.hash.substr(1);
        this.route.navigate([locationHash || '']);
      }
    });
  }

  login() {
    this.checkingAuth = true;
    this.auth.login();
  }
}
