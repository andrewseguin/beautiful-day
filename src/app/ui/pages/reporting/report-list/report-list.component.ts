import {Component} from '@angular/core';
import {Report} from 'app/model/report';
import {ReportsService} from 'app/service/reports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportSort} from 'app/pipe/report-search.pipe';
import {QueryDisplay} from 'app/utility/query-display';

@Component({
  selector: 'report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.scss']
})
export class ReportListComponent {
  reports: Report[] = [];
  search = '';
  sort: ReportSort = 'modifiedDate';
  reverseSort = true;
  sortOptions: ReportSort[] = ['name', 'modifiedDate', 'createdDate'];
  queryStrings: Map<Report, string> = new Map<Report, string>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reportsService: ReportsService) {
    this.reportsService.reports.subscribe(reports => {
      this.reports = reports;
      reports.forEach(report => {
        this.queryStrings.set(report, this.getQueryDisplay(report));
      });
    });
  }

  createReport() {
    this.reportsService.add()
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
