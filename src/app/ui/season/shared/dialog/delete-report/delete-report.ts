import {Component} from '@angular/core';
import {MatDialogRef, MatSnackBar, MatSnackBarConfig} from '@angular/material';
import {Router} from '@angular/router';
import {Report} from 'app/model/report';
import {ReportsDao} from 'app/ui/season/dao';

@Component({
  templateUrl: 'delete-report.html',
  styleUrls: ['delete-report.scss']
})
export class DeleteReport {
  report: Report;

  constructor(private dialogRef: MatDialogRef<DeleteReport>,
              private router: Router,
              private mdSnackbar: MatSnackBar,
              private reportsDao: ReportsDao) { }

  close() {
    this.dialogRef.close();
  }

  deleteReport() {
    // Delete report
    this.reportsDao.remove(this.report.id);

    const snackbarConfig = new MatSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Report ${this.report.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to projects
    this.router.navigateByUrl('reports');

    this.close();
  }
}
