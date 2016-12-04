import {Component, OnInit} from '@angular/core';
import {AngularFire} from "angularfire2";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  checkingAuth: boolean = true;

  constructor(private af: AngularFire) { }

  ngOnInit() {
    this.af.auth.subscribe(() => { this.checkingAuth = false });
  }

  login() {
    this.af.auth.login();
  }
}
