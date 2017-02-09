import { Component, OnInit } from '@angular/core';
import {Report} from "../../../../model/report";
import {ReportsService} from "../../../../service/reports.service";
import {Router, ActivatedRoute} from "@angular/router";
import {UsersService} from "../../../../service/users.service";
import {User} from "../../../../model/user";

@Component({
  selector: 'report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.scss']
})
export class ReportListComponent {
  reports: Report[] = [];
  user: User;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService,
              private reportsService: ReportsService) {
    this.usersService.getCurrentUser().subscribe(user => this.user = user);
    this.reportsService.getAll().subscribe(reports => this.reports = reports);
  }

  createReport() {
    this.reportsService.create(this.user.email)
        .then(response => this.navigateToReport(response.key));
  }

  navigateToReport(reportId: string) {
    this.router.navigate([reportId], {relativeTo: this.route});
  }
}
