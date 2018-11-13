import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project, ProjectsDao} from 'app/season/dao';
import {SelectionModel} from '@angular/cdk/collections';
import {map, takeUntil} from 'rxjs/operators';
import {ActivatedSeason, Permissions} from 'app/season/services';
import {EXPANSION_ANIMATION} from 'app/utility/animations';
import {combineLatest, Subject} from 'rxjs';
import {User} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {containsEmail} from 'app/season/utility/contains-email';

@Component({
  templateUrl: 'projects-page.html',
  styleUrls: ['projects-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION
})
export class ProjectsPage {
  projects = combineLatest([this.projectsDao.list, this.afAuth.authState]).pipe(
    map(result => {
      const projects = result[0] as Project[];
      const authState = result[1] as User;

      if (!authState || !projects) {
        return null;
      }

      const email = authState.email;
      return projects.sort((a, b) => {
        const involvedA = containsEmail(a.leads, email) ||
          containsEmail(a.directors, email) || containsEmail(a.acquisitions, email);
        const involvedB = containsEmail(b.leads, email) ||
          containsEmail(b.directors, email) || containsEmail(b.acquisitions, email);

        if (involvedA && !involvedB) {
          return -1;
        } else if (involvedB && !involvedA) {
          return 1;
        }

        return a.name < b.name ? -1 : 1;
      });
    }));

  expandedContacts = new SelectionModel<string>(true);
  loadedContacts = new Set<string>();

  private destroyed = new Subject();

  constructor(private router: Router,
              private afAuth: AngularFireAuth,
              private activatedRoute: ActivatedRoute,
              private permissions: Permissions,
              private activatedSeason: ActivatedSeason,
              private projectsDao: ProjectsDao) {
    this.expandedContacts.changed.pipe(takeUntil(this.destroyed))
        .subscribe(change => {
          change.added.forEach(v => this.loadedContacts.add(v));
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  navigateToProject(id: string) {
    this.router.navigate([`${this.activatedSeason.season.value}/project/${id}`]);
  }
}
