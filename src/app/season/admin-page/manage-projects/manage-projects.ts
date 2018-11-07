import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {SelectionModel} from '@angular/cdk/collections';
import {Project, ProjectsDao} from 'app/season/dao';

@Component({
  selector: 'manage-projects',
  styleUrls: ['manage-projects.scss'],
  templateUrl: 'manage-projects.html',
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageProjects {
  trackByProjectKey = (_i, p: Project) => p.id;
  hasExpanded = new Set<Project>();
  expandedProjects = new SelectionModel<Project>(true);

  constructor(public projectsDao: ProjectsDao) {
    this.expandedProjects.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }

}
