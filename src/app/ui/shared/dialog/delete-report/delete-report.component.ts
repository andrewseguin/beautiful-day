import { Component, OnInit } from '@angular/core';
import {Project} from "../../../../model/project";
import {MdDialogRef, MdSnackBar, MdSnackBarConfig} from "@angular/material";
import {ProjectsService} from "../../../../service/projects.service";
import {RequestsService} from "../../../../service/requests.service";
import {NotesService} from "../../../../service/notes.service";
import {Router} from "@angular/router";
import {Report} from "../../../../model/report";
import {ReportsService} from "../../../../service/reports.service";

@Component({
  selector: 'app-delete-report',
  templateUrl: 'delete-report.component.html',
  styleUrls: ['delete-report.component.scss']
})
export class DeleteReportComponent {
  report: Report;

  constructor(private dialogRef: MdDialogRef<DeleteReportComponent>,
              private router: Router,
              private mdSnackbar: MdSnackBar,
              private reportsService: ReportsService) { }

  close() {
    this.dialogRef.close();
  }

  deleteReport() {
    // Delete report
    this.reportsService.remove(this.report.$key);

    const snackbarConfig = new MdSnackBarConfig();
    snackbarConfig.duration = 2000;
    this.mdSnackbar.open(`Report ${this.report.name} deleted`, null, snackbarConfig);

    // TODO(andrewjs): Navigate to home
    this.router.navigateByUrl('reporting');

    this.close();
  }
}
