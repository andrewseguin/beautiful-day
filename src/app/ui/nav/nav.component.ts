import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from "angularfire2";
import {MdSidenav} from "@angular/material";

import {ProjectsService} from '../../service/projects.service';
import {Router} from "@angular/router";

@Component({
  selector: 'nav-content',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  projects: FirebaseListObservable<any[]>;

  constructor(private projectsService: ProjectsService,
              private router: Router) { }

  @Input() sidenav: MdSidenav;

  ngOnInit() {
    this.projects = this.projectsService.getProjects();
  }

  addProject() {
    this.projectsService.createProject().then(response => {
      this.router.navigate([`project/${response.getKey()}`]);
      this.sidenav.close();
    });
  }
}
