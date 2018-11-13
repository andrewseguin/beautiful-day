import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, take, takeUntil} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Title as WindowTitle} from '@angular/platform-browser';
import {CdkPortal} from '@angular/cdk/portal';
import {ProjectsDao, ReportsDao} from 'app/season/dao';
import {ActivatedSeason} from './activated-season';
import {Subject} from 'rxjs';

const SECTIONS = new Map<string, string>([
  ['projects', 'Projects'],
  ['inventory', 'Inventory'],
  ['login', 'Login to BD365 Management'],
  ['home', 'Home'],
  ['reports', 'Reports'],
  ['events', 'Events'],
  ['help', 'Help'],
  ['admin', 'Admin'],
]);


@Injectable()
export class Header {
  goBack: () => void | null;
  title = new BehaviorSubject<string>('Loading...');

  toolbarOutlet = new BehaviorSubject<CdkPortal>(null);

  destroyed = new Subject();

  constructor(private projectsDao: ProjectsDao,
              private reportsDao: ReportsDao,
              private windowTitle: WindowTitle,
              private activatedSeason: ActivatedSeason,
              private router: Router) {
    this.title.pipe(takeUntil(this.destroyed))
        .subscribe(title => this.windowTitle.setTitle(title));
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.destroyed))
      .subscribe((e: NavigationEnd) => {
        this.goBack = null;
        const urlParts = e.urlAfterRedirects.split('/');
        const section = urlParts[2].split(';')[0]; // split ; for print; with data
        const id = urlParts[3];

        if (section === 'project') {
          this.onProjectRoute(id);
        } else if (section === 'report') {
          this.onReportRoute(id);
        } else if (section === 'print') {
          this.goBack = () => window.history.back();
          // Title will be set by print page
        } else if (SECTIONS.has(section)) {
          this.title.next(SECTIONS.get(section));
        } else {
          this.title.next('BD365 Management');
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onProjectRoute(projectId: string) {
    const season = this.activatedSeason.season.value;
    this.goBack = () => this.router.navigate([`/${season}/projects`]);

    this.title.next('Loading project...');
    this.projectsDao.get(projectId).pipe(
        take(1))
        .subscribe(p => this.title.next(p ? p.name : ''));
  }

  onReportRoute(reportId: string) {
    const season = this.activatedSeason.season.value;
    this.goBack = () => this.router.navigate([`/${season}/reports`]);

    if (reportId === 'new') {
      return;
    }

    this.title.next('Loading report...');
    return this.reportsDao.get(reportId).pipe(
        take(1))
        .subscribe(r => this.title.next(r ? r.name : ''));
  }
}
