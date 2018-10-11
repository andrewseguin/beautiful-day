import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {ProjectsService} from 'app/service/projects.service';
import {of} from 'rxjs/observable/of';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Title as WindowTitle} from '@angular/platform-browser';
import {CdkPortal} from '@angular/cdk/portal';

const TOP_LEVEL_SECTION_TITLES = new Map<string, string>([
  ['projects', 'Projects'],
  ['inventory', 'Inventory'],
  ['login', 'Login to BD365 Management'],
  ['home', 'Home'],
  ['reporting', 'Reporting'],
  ['events', 'events'],
  ['feedback', 'feedback'],
  ['help', 'Help'],
]);


@Injectable()
export class HeaderService {
  goBack: () => void | null;
  title = new BehaviorSubject<string>('Loading...');
  toolbarOutlet: CdkPortal;

  constructor(private projectsService: ProjectsService,
              private windowTitle: WindowTitle,
              private router: Router) { }

  /** Watch route changes and update the title accordingly. */
  observeChanges() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      mergeMap((e: NavigationEnd) => {
        this.goBack = null;
        const urlParts = e.url.split('/');

        if (urlParts[1] === 'project') {
          const projectId = urlParts[2];
          return this.projectsService.get(projectId).pipe(
            map(project => {
              this.goBack = () => this.router.navigate(['/projects']);
              return project.name;
            }),
            take(1));
        } else if (TOP_LEVEL_SECTION_TITLES.has(urlParts[1])) {
          return of(TOP_LEVEL_SECTION_TITLES.get(urlParts[1]));
        } else {
          return of('BD365 Management');
        }
      }))
      .subscribe(title => {
        this.title.next(title);
        this.windowTitle.setTitle(title);
      });
  }
}
