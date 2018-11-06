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

  seasons = [];
  projectsBySeason: Map<string, Map<string, Project>>;

  constructor(private projectsDao: ProjectsDao,
              private changeDetectorRef: ChangeDetectorRef) {
    // Get list of projects, categorize them by season
    this.projectsDao.list.subscribe(projects => {
      if (!projects) {
        // Still loading
        return;
      }

      this.projectsBySeason = new Map<string, Map<string, Project>>();
      projects.forEach(project => {
        if (!this.projectsBySeason.get(project.season)) {
          this.projectsBySeason.set(project.season, new Map());
        }

        this.projectsBySeason.get(project.season).set(project.id, project);
      });

      this.seasons = Array.from(this.projectsBySeason.keys()).sort().reverse();
      this.changeDetectorRef.markForCheck();
    });

    this.expandedProjects.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }

}
