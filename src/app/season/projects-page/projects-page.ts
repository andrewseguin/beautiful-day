import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Project, ProjectsDao} from 'app/season/dao';
import {SelectionModel} from '@angular/cdk/collections';
import {map, takeUntil} from 'rxjs/operators';
import {ActivatedSeason, Permissions} from 'app/season/services';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {Subject} from 'rxjs';

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

  private destroyed = new Subject();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private projectsDao: ProjectsDao) {
    this.expandedContacts.changed.pipe(takeUntil(this.destroyed))
        .subscribe(change => {
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

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateToProject(id: string) {
    this.router.navigate([`${this.activatedSeason.season.value}/project/${id}`]);
  }
}
