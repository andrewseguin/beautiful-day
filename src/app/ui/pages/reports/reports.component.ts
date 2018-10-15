import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Report} from 'app/model/report';
import {ReportSort} from 'app/pipe/report-search.pipe';
import {ReportsService} from 'app/service/reports.service';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reports: Report[] = [];
  search = '';
  sort: ReportSort = 'modifiedDate';
  reverseSort = true;
  sortOptions: ReportSort[] = ['name', 'modifiedDate', 'createdDate'];

  constructor(private router: Router,
              private reportsService: ReportsService) {
    this.reportsService.reports.subscribe(reports => {
      this.reports = reports;
    });
  }

  createReport() {
    this.router.navigate([`report/new`]);
  }

  navigateToReport(reportId: string) {
    this.router.navigate([`report/${reportId}`]);
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
}
