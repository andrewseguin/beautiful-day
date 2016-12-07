import {Component, OnInit} from '@angular/core';
import {FirebaseAuth} from "angularfire2";
import {Router} from "@angular/router";
import {ProjectsService} from "./service/projects.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private auth: FirebaseAuth,
              private projectsService: ProjectsService,
              private router: Router) {}

  ngOnInit() {
    this.auth.subscribe(auth => {
      if (!auth) {
        // Navigate to the login and pass it the current location
        // so that after login, it can redirect back.
        this.router.navigate(['login'], {fragment: location.pathname});
        return;
      }

      if (location.pathname == '/') {
        this.projectsService.getUsersProjects(auth.auth.email).take(1).subscribe(projects => {
          let id = projects.length > 0 ? projects[0].$key : '';
          this.router.navigate([`project/${id}`]);
        });
      }
    });

  }
}
