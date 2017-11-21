import { Component, OnInit } from '@angular/core';
import {ProjectsService} from '../../../service/projects.service';
import {Project} from '../../../model/project';
import {Router} from '@angular/router';
import {HeaderService} from '../../../service/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects: Project[];

  constructor(
    private projectsService: ProjectsService,
    private headerService: HeaderService,
    private router: Router) { }

  ngOnInit() {
    this.headerService.title = 'Home';

    this.projectsService.getSortedProjects()
        .subscribe(projects => this.projects = projects);
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`]);
  }

}
