import {Component, Input} from '@angular/core';
import {PromptDialogComponent} from 'app/ui/pages/shared/dialog/prompt-dialog/prompt-dialog.component';
import {MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Report} from 'app/model/report';
import {ReportsService} from 'app/service/reports.service';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from 'app/model/user';
import {DeleteReportComponent} from 'app/ui/pages/shared/dialog/delete-report/delete-report.component';
import {isMobile} from 'app/utility/media-matcher';

@Component({
  selector: 'report',
  templateUrl: 'report.component.html',
  styleUrls: ['report.component.scss']
})
export class ReportComponent {
  isMobile = isMobile;
  report: Report;
  user: User;

  _reportId: string;
  @Input() set reportId(reportId: string) {
    this._reportId = reportId;

    this.reportsService.get(reportId).subscribe(report => {
      if (report) {
        this.report = report;
      }
    });
  }
  get reportId(): string { return this._reportId; }

  constructor(private mdDialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private mdSnackBar: MatSnackBar,
              private reportsService: ReportsService) {
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

  deleteReport() {
    const dialogRef = this.mdDialog.open(DeleteReportComponent);
    dialogRef.componentInstance.report = this.report;
  }
}
