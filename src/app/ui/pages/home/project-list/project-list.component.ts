import {Component, Input, OnInit} from '@angular/core';
import {ProjectsService} from 'app/service/projects.service';
import {Project} from 'app/model/project';
import {Router} from '@angular/router';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[];

  @Input() season;

  constructor(
    private projectsService: ProjectsService,
    private router: Router) { }

  ngOnInit() {
    this.projectsService.getSortedProjects(this.season)
        .subscribe(projects => this.projects = projects);
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`]);
  }

}
