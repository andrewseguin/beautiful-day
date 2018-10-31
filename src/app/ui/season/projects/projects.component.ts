import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Project} from 'app/model/project';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProjectsDao} from 'app/ui/season/dao';
import {SelectionModel} from '@angular/cdk/collections';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {map} from 'rxjs/operators';
import {PermissionsService} from 'app/ui/season/services';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

@Component({
  selector: 'project-list',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('contacts', [
      state('void, false', style({height: '0px'})),
      state('true', style({height: '*'})),
      transition('* <=> *', animate(ANIMATION_DURATION)),
    ]),
    trigger('arrow', [
      state('void, false', style({transform: 'rotateX(0deg)'})),
      state('true', style({transform: 'rotateX(180deg)'})),
      transition('* <=> *', animate(ANIMATION_DURATION)),
    ]),
  ]
})
export class ProjectsComponent {
  projects: Observable<Project[]>;

  expandedContacts = new SelectionModel<string>(true);
  loadedContacts = new Set<string>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private permissionsService: PermissionsService,
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
