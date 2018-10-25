import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {Report} from 'app/model/report';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReportDialog} from 'app/ui/season/shared/dialog/report.dialog';
import {ReportsDao, RequestsDao} from 'app/ui/season/dao';

interface ReportGroup {
  reports: Report[];
  name: string;
}

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  reportGroups: Observable<ReportGroup[]>;
  reportKeyTrackBy = (_i, report: Report) => report.id;

  constructor(private router: Router,
              private reportDialog: ReportDialog,
              private reportsDao: ReportsDao) {
    this.reportGroups = this.reportsDao.list.pipe(map(getSortedGroups));
  }

  createReport() {
    this.router.navigate([`report/new`]);
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

