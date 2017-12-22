import {Component, Input} from '@angular/core';
import {Request} from 'app/model/request';
import {PromptDialogComponent} from 'app/ui/pages/shared/dialog/prompt-dialog/prompt-dialog.component';
import {ProjectsService} from 'app/service/projects.service';
import {ItemsService} from 'app/service/items.service';
import {RequestsService} from 'app/service/requests.service';
import {MediaQueryService} from 'app/service/media-query.service';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Report} from 'app/model/report';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {ReportsService} from 'app/service/reports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from 'app/service/users.service';
import {User} from 'app/model/user';
import {ReportQueryService} from 'app/service/report-query.service';
import {DisplayOptions} from 'app/model/display-options';
import {DeleteReportComponent} from 'app/ui/pages/shared/dialog/delete-report/delete-report.component';

@Component({
  selector: 'report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.scss']
})
export class ReportComponent {
  report: Report;
  items: Item[];
  projects: Project[];
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  user: User;

  _reportId: string;
  @Input() set reportId(reportId: string) {
    this._reportId = reportId;

    this.reportsService.get(reportId).subscribe(report => {
      if (report) {
        this.report = report; this.performQuery();
      }
    });

    this.requestsService.requests.subscribe(requests => {
      this.requests = requests; this.performQuery();
    });

    this.itemsService.items.subscribe(items => {
      this.items = items; this.performQuery();
    });

    this.projectsService.projects.subscribe(projects => {
      this.projects = projects; this.performQuery();
    });
  }
  get reportId(): string { return this._reportId; }

  constructor(private mdDialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private mdSnackBar: MatSnackBar,
              private usersService: UsersService,
              private mediaQuery: MediaQueryService,
              private requestsService: RequestsService,
              private itemsService: ItemsService,
              private projectsService: ProjectsService,
              private reportQueryService: ReportQueryService,
              private reportsService: ReportsService) {
    this.usersService.getCurrentUser().subscribe(user => this.user = user);
  }

  isMobile(): boolean {
    return this.mediaQuery.isMobile();
  }

  saveQueryStages() {
    this.reportsService.update(this.report.$key, {
      queryStages: this.report.queryStages,
      modifiedBy: this.user.email,
      modifiedDate: new Date().getTime().toString()
    });
  }

  navigateToReportList() {
    this.router.navigate(['reporting']);
  }

  openEditNameDialog() {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);
    dialogRef.componentInstance.title = 'Edit Report Name';
    dialogRef.componentInstance.input = this.report.name;
    dialogRef.componentInstance.onSave().subscribe(name => {
      name = name.toString();
      this.report.name = name;
      this.reportsService.update(this.report.$key, {name});
    });
  }

  hasQuery() {
    if (!this.report) { return false; }
    const queryStages = this.report.queryStages;
    const firstQuerySet = queryStages[0].querySet;

    const isEmptyQuery = queryStages.length == 1 &&
      firstQuerySet.length == 1 &&
      firstQuerySet[0].queryString == '';

    return !isEmptyQuery;
  }

  performQuery() {
    if (!this.items || !this.projects || !this.requests || !this.hasQuery()) { return; }

    this.filteredRequests = this.reportQueryService.query(
        this.report.queryStages, this.requests, this.items, this.projects);
  }

  duplicateReport() {
    this.reportsService.add(this.report).then(response => {
      this.router.navigate([`../${response.key}`], {relativeTo: this.route});

      const snackbarConfig = new MatSnackBarConfig();
      snackbarConfig.duration = 2000;
      this.mdSnackBar.open('Report copied!', '', snackbarConfig);
    });
  }

  print() {
    window.open(`print/report/${this.reportId}`, 'print', 'width=650, height=500');
  }

  updateDisplayOptions(displayOptions: DisplayOptions) {
    this.reportsService.update(this.reportId, {displayOptions});
  }

  deleteReport() {
    const dialogRef = this.mdDialog.open(DeleteReportComponent);
    dialogRef.componentInstance.report = this.report;
  }
}
