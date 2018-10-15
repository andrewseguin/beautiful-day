import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Project} from 'app/model/project';
import {ProjectsService} from 'app/service/projects.service';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.projectsService.get(params['id']).subscribe(project => {
        this.loading = false;

        // Validate that this project exists, currently doing a hacky way by
        // just checking the project has a name.
        if (project.name) {
          this.project = project;
        }
      });
    });
  }
}
