import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ProjectsService} from 'app/service/projects.service';
import {EXPANSION_ANIMATION} from 'app/ui/shared/animations';
import {Project} from 'app/model/project';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'manage-projects',
  styleUrls: ['manage-projects.component.scss'],
  templateUrl: 'manage-projects.component.html',
  animations: EXPANSION_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageProjectsComponent {
  trackBySeason = (_i, season) => season;
  trackByProjectKey = (_i, item: Project) => item.$key;
  hasExpanded = new Set<Project>();
  expandedProjects = new SelectionModel<Project>(true);

  seasons = [];
  projectsBySeason: Map<string, Map<string, Project>>;

  constructor(private projectsService: ProjectsService,
              private changeDetectorRef: ChangeDetectorRef) {
    // Get list of projects, categorize them by season
    this.projectsService.projects.subscribe(projects => {
      this.projectsBySeason = new Map<string, Map<string, Project>>();
      projects.forEach(project => {
        if (!this.projectsBySeason.get(project.season)) {
          this.projectsBySeason.set(project.season, new Map());
        }

        this.projectsBySeason.get(project.season).set(project.$key, project);
      });

      this.seasons = Array.from(this.projectsBySeason.keys()).sort().reverse();
      this.changeDetectorRef.markForCheck();
    });

    this.expandedProjects.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }

}
