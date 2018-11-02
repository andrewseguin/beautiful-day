import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Project} from 'app/model/project';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProjectsDao} from 'app/ui/season/dao';
import {SelectionModel} from '@angular/cdk/collections';
import {map} from 'rxjs/operators';
import {Permissions} from 'app/ui/season/services';
import {EXPANSION_ANIMATION} from 'app/ui/shared/animations';

@Component({
  templateUrl: 'projects-page.html',
  styleUrls: ['projects-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION
})
export class ProjectsPage {
  projects: Observable<Project[]>;

  expandedContacts = new SelectionModel<string>(true);
  loadedContacts = new Set<string>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private permissions: Permissions,
              private projectsDao: ProjectsDao) {
    this.expandedContacts.changed.subscribe(change => {
      change.added.forEach(v => this.loadedContacts.add(v));
    });
  }

  ngOnInit() {
    this.projects = this.projectsDao.list.pipe(map(projects => {
      if (projects) {
        return projects.sort((a, b) => a.name < b.name ? -1 : 1);
      }
    }));
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`], {relativeTo: this.activatedRoute.parent});
  }
}
