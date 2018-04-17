import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, take} from 'rxjs/operators';
import {ProjectsService} from 'app/service/projects.service';
import {of} from 'rxjs/observable/of';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Title as WindowTitle} from '@angular/platform-browser';

@Injectable()
export class TitleService {
  title = new BehaviorSubject<string>('Loading...');

  constructor(private projectsService: ProjectsService,
              private windowTitle: WindowTitle,
              private router: Router) { }

  /** Watch route changes and update the title accordingly. */
  observeChanges() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      mergeMap((e: NavigationEnd) => {
        const urlParts = e.url.split('/');

        switch (urlParts[1]) {
          case 'project':
            const projectId = urlParts[2];
            return this.projectsService.get(projectId).pipe(
              map(project => project.name),
              take(1));
          case 'inventory':
            return of('Inventory');
          case 'feedback':
            return of('Feedback');
          case 'reporting':
            return of('Reporting');
          case 'events':
            return of('Events');
          default:
            return of('BD365 Management');
        }
      }))
      .subscribe(title => {
        this.title.next(title);
        this.windowTitle.setTitle(title);
      });
  }
}
