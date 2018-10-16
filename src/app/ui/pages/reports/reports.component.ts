import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Report} from 'app/model/report';
import {ReportsService} from 'app/service/reports.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
  Filter,
  RequestRendererOptionsState
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {ReportsDialog} from 'app/ui/pages/shared/dialog/reports.dialog';
import {EXPANSION_ANIMATION} from 'app/ui/shared/animations';
import {ProjectsService} from 'app/service/projects.service';
import {RequestsService} from 'app/service/requests.service';

interface ReportGroup {
  reports: Report[];
  name: string;
}

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnDestroy {
  reportGroups: ReportGroup[];
  reportKeyTrackBy = (_i, report: Report) => report.$key;

  private destroyed = new Subject();

  constructor(private router: Router,
              private reportsDialog: ReportsDialog,
              private cd: ChangeDetectorRef,
              private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private reportsService: ReportsService) {
    this.reportsService.reports.pipe(
        takeUntil(this.destroyed))
        .subscribe(reports => this.setupRenderGroups(reports));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  createReport() {
    this.router.navigate([`report/new`]);
  }

  navigateToReport(reportId: string) {
    this.router.navigate([`report/${reportId}`]);
  }

  getFilters(report: Report) {
    if (!report.options ||
        !report.options.filters ||
        !report.options.filters.length) {
      return [];
    }

    return report.options.filters;
  }

  filterToString(filter: Filter) {
    switch (filter.type) {
      case 'project':
        return filter.query['project'];
      case 'purchaser':
        return filter.query['purchaser'];
      case 'dropoff date':
        return `${filter.query['equality']}  ${filter.query['date']}`;
      case 'request cost':
      case 'item cost':
        return `${filter.query['equality']} ${filter.query['cost']}`;
      case 'dropoff location':
        return filter.query['location'];
      case 'season':
        return filter.query['season'];
    }
  }

  private setupRenderGroups(reports: Report[]) {
    const reportGroups = new Map<string, Report[]>();
    reports.forEach(report => {
      const group = report.group || 'Other';
      if (!reportGroups.has(group)) {
        reportGroups.set(group, []);
      }

      reportGroups.get(group).push(report);
    });

    this.reportGroups = [];
    Array.from(reportGroups.keys()).sort().forEach(group => {
      const reports = reportGroups.get(group);
      reports.sort((a, b) => a.name < b.name ? -1 : 1);
      this.reportGroups.push({name: group, reports});
    });

    this.cd.markForCheck();
  }
}
