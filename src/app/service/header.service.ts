import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, take} from 'rxjs/operators';
import {ProjectsService} from 'app/service/projects.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Title as WindowTitle} from '@angular/platform-browser';
import {CdkPortal} from '@angular/cdk/portal';
import {ReportsService} from 'app/service/reports.service';

const TOP_LEVEL_SECTION_TITLES = new Map<string, string>([
  ['projects', 'Projects'],
  ['inventory', 'Inventory'],
  ['login', 'Login to BD365 Management'],
  ['home', 'Home'],
  ['reports', 'Reports'],
  ['events', 'Events'],
  ['feedback', 'Feedback'],
  ['help', 'Help'],
]);


@Injectable()
export class HeaderService {
  goBack: () => void | null;
  title = new BehaviorSubject<string>('Loading...');
  toolbarOutlet: CdkPortal;

  constructor(private projectsService: ProjectsService,
              private reportsService: ReportsService,
              private windowTitle: WindowTitle,
              private router: Router) {
    this.title.subscribe(title => this.windowTitle.setTitle(title));
  }

  /** Watch route changes and update the title accordingly. */
  observeChanges() {
    this.router.events.pipe(
        filter(e => e instanceof NavigationEnd))
        .subscribe((e: NavigationEnd) => {
          this.goBack = null;
          const urlParts = e.url.split('/');

          if (urlParts[1] === 'project') {
            this.onProjectRoute(urlParts[2]);
          } else if (urlParts[1] === 'report') {
            this.onReportRoute(urlParts[2]);
          } else if (TOP_LEVEL_SECTION_TITLES.has(urlParts[1])) {
            this.title.next(TOP_LEVEL_SECTION_TITLES.get(urlParts[1]));
          } else {
            this.title.next('BD365 Management');
          }
        });
  }

  onProjectRoute(projectId: string) {
    this.goBack = () => this.router.navigate(['/projects']);

    this.title.next('Loading project...');
    this.projectsService.get(projectId).pipe(
        take(1))
        .subscribe(project => {
          this.title.next(project.name);
        });
  }

  onReportRoute(reportId: string) {
    this.goBack = () => this.router.navigate(['/reports']);

    if (reportId === 'new') {
      return;
    }

    this.title.next('Loading report...');
    return this.reportsService.get(reportId).pipe(
        take(1))
        .subscribe(report => {
          this.title.next(report.name);
        });
  }
}
