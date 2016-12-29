import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from "angularfire2";
import {Router, NavigationEnd, Event} from "@angular/router";
declare let ga:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: FirebaseAuth,
              private router: Router) {
    this.router.events.subscribe((event: Event) => {
      console.log('Route changed');
      if (event instanceof NavigationEnd) {
        console.log('Sending event');
        ga('send', 'pageview', event.urlAfterRedirects);
      }
    });
  }

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
