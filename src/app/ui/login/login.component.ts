import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "angularfire2";
import { Router } from "@angular/router";
import { UsersService } from "../../service/users.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  checkingAuth: boolean = true;

  constructor(private auth: AngularFireAuth,
    private usersService: UsersService,
    private route: Router) { }

  ngOnInit() {
    this.auth.subscribe(auth => {
      if (!auth) {
        this.checkingAuth = false;
        return;
      }

      // Store credentials if we do not already have them.
      this.usersService.get(auth.auth.email).take(1).subscribe(user => {
        if (!user) { this.usersService.create(auth); }

        // Navigate out of login.
        let locationHash = window.location.hash.substr(1);
        this.route.navigate([locationHash || '']);
      });
    });
  }

  login() {
    this.checkingAuth = true;
    this.auth.login();
  }
}
