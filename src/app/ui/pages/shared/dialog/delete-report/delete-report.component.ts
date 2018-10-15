import {Component} from '@angular/core';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Router} from '@angular/router';
import {Report} from 'app/model/report';
import {ReportsService} from 'app/service/reports.service';

@Component({
  selector: 'app-delete-report',
  templateUrl: 'delete-report.component.html',
  styleUrls: ['delete-report.component.scss']
})
export class DeleteReportComponent {
  report: Report;

  constructor(private dialogRef: MatDialogRef<DeleteReportComponent>,
              private router: Router,
              private mdSnackbar: MatSnackBar,
              private reportsService: ReportsService) { }

  close() {
    this.dialogRef.close();
  }

  deleteReport() {
    // Delete report
    this.reportsService.remove(this.report.$key);

    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Report ${this.report.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to projects
    this.router.navigateByUrl('reports');

    this.close();
  }
}
