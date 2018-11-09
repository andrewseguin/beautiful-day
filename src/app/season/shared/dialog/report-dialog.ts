import {Injectable} from '@angular/core';
import {ReportEdit} from 'app/season/shared/dialog/report-edit/report-edit';
import {take} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {RequestRendererOptionsState} from '../../services/requests-renderer/request-renderer-options';
import {AngularFireAuth} from '@angular/fire/auth';
import {Report, ReportsDao} from 'app/season/dao';
import {DeleteConfirmation} from './delete-confirmation/delete-confirmation';
import {of} from 'rxjs';

@Injectable()
export class ReportDialog {
  constructor(private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private router: Router,
              private afAuth: AngularFireAuth,
              private reportsDao: ReportsDao) {}

  /** Shows the edit report dialog to change the name/group.*/
  editReport(report: Report) {
    const data = {
      name: report.name,
      group: report.group,
    };

    this.dialog.open(ReportEdit, {data}).afterClosed().pipe(
        take(1))
        .subscribe(result => {
        if (result) {
          this.reportsDao.update(report.id, {
            name: result['name'],
            group: result['group']
          });
        }
    });
  }

  /**
   * Shows delete report dialog. If user confirms deletion, remove the report and
   * navigate to the reports page.
   */
  deleteReport(report: Report) {
    const data = {name: of(report.name)};

    this.dialog.open(DeleteConfirmation, {data}).afterClosed().pipe(
        take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.reportsDao.remove(report.id);
            this.snackbar.open(`Report "${report.name}" deleted`, null, {duration: 2000});
          }
        });
  }

  /**
   * Shows edit report dialog to enter the name/group. If user enters a name,
   * save the report and automatically navigate to the report page with $key,
   * replacing the current URL.
   */
  saveAsReport(currentOptions: RequestRendererOptionsState, season: string) {
    this.dialog.open(ReportEdit).afterClosed().pipe(
        take(1))
        .subscribe(result => {
          if (!result) {
            return;
          }

          const report = {
            name: result['name'],
            group: result['group'],
            options: currentOptions
          };

          this.reportsDao.add(report).then(id => {
            this.router.navigate([`${season}/report/${id}`], {
              replaceUrl: true
            });
          });
        });
  }
}
