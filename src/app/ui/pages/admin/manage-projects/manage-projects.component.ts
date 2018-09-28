import {Component} from '@angular/core';
import {ProjectsService} from 'app/service/projects.service';
import {EXPANSION_ANIMATION} from 'app/ui/shared/animations';
import {Project} from 'app/model/project';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'manage-projects',
  styleUrls: ['manage-projects.component.scss'],
  templateUrl: 'manage-projects.component.html',
  animations: EXPANSION_ANIMATION
})
export class ManageProjectsComponent {
  hasExpanded = new Set<Project>();
  expandedProjects = new SelectionModel<Project>(true);

  constructor(private projectsService: ProjectsService) {

    this.expandedProjects.changed.subscribe(change => {
      change.added.forEach(p => this.hasExpanded.add(p));
    });
  }

}
