import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectsDao} from 'app/season/dao';
import {map, switchMap, tap} from 'rxjs/operators';
import {Project} from '../dao';

@Component({
  templateUrl: 'project-page.html',
  styleUrls: ['project-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPage {
  isLoading = true;

  fetchedProjectData = this.activatedRoute.params.pipe(
    tap(() => this.isLoading = true),
    map(params => params.id),
    switchMap(id => this.projectsDao.get(id)),
    map(project => ({project} as {project: Project})),
    tap(() => this.isLoading = false),
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectsDao: ProjectsDao) {}
}
