import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Project} from 'app/model/project';
import {ProjectsDao} from 'app/service/dao';

@Component({
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: Project;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private projectsDao: ProjectsDao) {}

  ngOnInit() {
    const projectId = this.route.snapshot.params.id;
    this.projectsDao.get(projectId).subscribe(project => {
      this.loading = false;
      this.project = project;
    });
  }
}
