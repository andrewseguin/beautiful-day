import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from "angularfire2";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: FirebaseAuth, private router: Router) {}

  ngOnInit() {
    this.auth.subscribe(auth => {
      if (!auth) {
        this.router.navigate(['login'])
      } else {
        this.router.navigate(['']);
      }
    });
  }
}
