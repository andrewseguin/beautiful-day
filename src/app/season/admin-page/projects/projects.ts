import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {Project, ProjectsDao} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';

@Component({
  selector: 'projects',
  styleUrls: ['projects.scss'],
  templateUrl: 'projects.html',
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects {
  trackById = (_i, p: Project) => p.id;
  hasExpanded = new Set<string>();
  expandedProjects = new SelectionModel<string>(true);

  projects = this.projectsDao.list.pipe(sortByDateCreated);

  constructor(public projectsDao: ProjectsDao, private cd: ChangeDetectorRef) {
    this.expandedProjects.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }
}
