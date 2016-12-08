import { Component, OnInit } from '@angular/core';
import {ProjectsService} from "../../service/projects.service";
import {Project} from "../../model/project";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {
  projects: Project[];

  constructor(
    private projectsService: ProjectsService,
    private router: Router) { }

  ngOnInit() {
    this.projectsService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`]);
  }

}
