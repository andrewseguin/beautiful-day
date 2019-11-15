import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project, ProjectsDao} from 'app/season/dao';
import {ActivatedSeason, Permissions} from 'app/season/services';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {combineLatest, Subject} from 'rxjs';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {containsEmail} from 'app/season/utility/contains-email';
import {map} from 'rxjs/operators';


@Component({
  templateUrl: 'projects-page.html',
  styleUrls: ['projects-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION
})
export class ProjectsPage {
  showAllProjects = this.permissions.permissions.pipe(
      map(p => {
        if (!p) {
          return false;
        }

        return p.has('owners') ||
          p.has('admins') ||
          p.has('acquisitions') ||
          p.has('approvers');
      }));

  allProjects = this.projectsDao.list.pipe(
      map(projects => projects ? projects.sort(sortByName) : null));

  involvedProjects = combineLatest([this.projectsDao.list, this.afAuth.authState]).pipe(
      map(result => {
        let projects = result[0] as Project[];
        const authState = result[1] as User;

        if (!authState || !projects) {
          return null;
        }

        projects = projects.sort();
        return {
          involved: projects.filter(p => isInvolved(p, authState.email)),
          others: projects.filter(p => !isInvolved(p, authState.email))
        };
      }));

  private destroyed = new Subject();

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private activatedRoute: ActivatedRoute,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private projectsDao: ProjectsDao) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

function isInvolved(project: Project, email: string) {
  return containsEmail(project.leads, email) ||
    containsEmail(project.directors, email) ||
    containsEmail(project.acquisitions, email);
}

function sortByName(a, b) {
  return a.name < b.name ? -1 : 1;
}
