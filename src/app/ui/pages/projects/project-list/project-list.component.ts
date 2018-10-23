import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Project} from 'app/model/project';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProjectsDao} from 'app/service/dao';
import {SelectionModel} from '@angular/cdk/collections';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

const ANIMATION_DURATION = '250ms cubic-bezier(0.35, 0, 0.25, 1)';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
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
export class ProjectListComponent {
  projects: Observable<Project[]>;

  expandedContacts = new SelectionModel<string>(true);
  loadedContacts = new Set<string>();

  @Input() season: string;

  constructor(private router: Router,
              private projectsDao: ProjectsDao) {
    this.expandedContacts.changed.subscribe(change => {
      change.added.forEach(v => this.loadedContacts.add(v));
    });
  }

  ngOnInit() {
    this.projects = this.projectsDao.list.pipe(map(projects => {
      if (projects) {
        return projects.filter(p => p.season === this.season)
                       .sort((a, b) => a.name < b.name ? -1 : 1);
      }
    }));
  }

  navigateToProject(id: string) {
    this.router.navigate([`project/${id}`]);
  }

  getEmails(list: string) {
    if (list.indexOf(',') != -1) {
      return list.split(',');
    } else {
      // Handle the acquisitions case
      return list.split(' ');
    }
  }
}
