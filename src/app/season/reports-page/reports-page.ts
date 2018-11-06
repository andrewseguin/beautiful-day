import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReportDialog} from 'app/season/shared/dialog/report-dialog';
import {Report, ReportsDao} from 'app/season/dao';
import {ActivatedSeason} from '../services';

interface ReportGroup {
  reports: Report[];
  name: string;
}

@Component({
  templateUrl: 'reports-page.html',
  styleUrls: ['reports-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {
  reportGroups: Observable<ReportGroup[]>;
  reportKeyTrackBy = (_i, report: Report) => report.id;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private activatedSeason: ActivatedSeason,
              private reportDialog: ReportDialog,
              private reportsDao: ReportsDao) {
    this.reportGroups = this.reportsDao.list.pipe(map(getSortedGroups));
  }

  createReport() {
    this.router.navigate([`${this.activatedSeason.season.value}/report/new`]);
  }

  navigateToReport(id: string) {
    this.router.navigate([`${this.activatedSeason.season.value}/report/${id}`]);
  }
}

function getSortedGroups(reports: Report[]) {
  if (!reports) {
    return;
  }

  const groups = new Map<string, Report[]>();
  reports.forEach(report => {
    const group = report.group || 'Other';
    if (!groups.has(group)) {
      groups.set(group, []);
    }

    groups.get(group).push(report);
  });

  const sortedGroups = [];
  Array.from(groups.keys()).sort().forEach(group => {
    const reports = groups.get(group);
    reports.sort((a, b) => a.name < b.name ? -1 : 1);
    sortedGroups.push({name: group, reports});
  });

  return sortedGroups;
}

