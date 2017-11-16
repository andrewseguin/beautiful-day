import {Component} from '@angular/core';
import {Report} from "../../../../model/report";
import {ReportsService} from "../../../../service/reports.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../../service/users.service";
import {User} from "../../../../model/user";
import {ReportSort} from "../../../../pipe/report-search.pipe";
import {QueryDisplay} from '../../../../utility/query-display';
import {transformSnapshotActionList} from '../../../../utility/snapshot-tranform';

@Component({
  selector: 'report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.scss']
})
export class ReportListComponent {
  reports: Report[] = [];
  user: User;
  search = '';
  sort: ReportSort = 'modifiedDate';
  reverseSort = true;
  sortOptions: ReportSort[] = ['name', 'modifiedDate', 'createdDate'];
  queryStrings: Map<Report, string> = new Map<Report, string>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private reportsService: ReportsService) {
    this.usersService.getCurrentUser().subscribe(user => this.user = user);
    this.reportsService.getAll().snapshotChanges().map(transformSnapshotActionList).subscribe(reports => {
      this.reports = reports;
      for (const report of reports) {
        this.queryStrings.set(report, this.getQueryDisplay(report));
      }
    });
  }

  createReport() {
    this.reportsService.create(this.user.email)
        .then(response => this.navigateToReport(response.key));
  }

  navigateToReport(reportId: string) {
    this.router.navigate([reportId], {relativeTo: this.route});
  }

  setSort(sort: ReportSort) {
    this.reverseSort = this.sort === sort ? this.reverseSort = !this.reverseSort : false;
    this.sort = sort;
  }

  getSortName(sort: ReportSort) {
    switch (sort) {
      case 'name': return 'Name';
      case 'createdDate': return 'Created Date';
      case 'modifiedDate': return 'Modified Date';
    }
  }

  getQueryDisplay(report: Report): string {
    return QueryDisplay.get(report.queryStages);
  }
}
