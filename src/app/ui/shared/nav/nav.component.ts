import {Component, OnInit, Input} from '@angular/core';
import {FirebaseListObservable} from "angularfire2";
import {MdSidenav} from "@angular/material";

import {ProjectsService} from '../../../service/projects.service';
import {Router} from "@angular/router";
import {PermissionsService} from "../../../service/permissions.service";
import {Project} from "../../../model/project";

@Component({
  selector: 'nav-content',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  canCreateProjects: boolean;
  canViewFeedback: boolean;
  canManageAcqusitions: boolean;
  projects: Project[];

  constructor(private projectsService: ProjectsService,
              private permissionsService: PermissionsService,
              private router: Router) { }

  @Input() sidenav: MdSidenav;

  ngOnInit() {
    this.projectsService.getSortedProjects()
        .subscribe(projects => this.projects = projects);

    this.permissionsService.canCreateProjects()
        .subscribe(canCreateProjects => this.canCreateProjects = canCreateProjects);

    this.permissionsService.canViewFeedback()
      .subscribe(canViewFeedback => this.canViewFeedback = canViewFeedback);

    this.permissionsService.canManageAcqusitions()
      .subscribe(canManageAcqusitions => this.canManageAcqusitions = canManageAcqusitions);
  }

  addProject() {
    this.projectsService.createProject().then(response => {
      this.router.navigate([`project/${response.getKey()}`]);
      this.sidenav.close();
    });
  }

  nagivateToHome() {
    this.router.navigate(['/home']);
    this.sidenav.close();
  }
}
