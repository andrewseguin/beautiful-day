import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from 'angularfire2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: FirebaseAuth,
              private router: Router) {}

  ngOnInit() {
    this.auth.subscribe(auth => {
      if (!auth) {
        // Store a redirect for post-login. If the current path is login, do not make this redirect.
        let redirect = location.pathname != '/login' ? location.pathname : '';

        // Navigate to the login and pass it the current location
        // so that after login, it can redirect back.
        this.router.navigate(['login'], {fragment: redirect});
        return;
      }
    });

  }
}
