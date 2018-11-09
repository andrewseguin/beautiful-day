import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReportDialog} from 'app/season/shared/dialog/report-dialog';
import {Report} from 'app/season/dao';
import {ActivatedSeason} from 'app/season/services';
import {Router} from '@angular/router';
import {RequestRendererOptionsState} from 'app/season/services/requests-renderer/request-renderer-options';

@Component({
  selector: 'report-menu',
  templateUrl: 'report-menu.html',
  styleUrls: ['report-menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportMenu {
  @Input() report: Report;

  @Input() icon: 'settings' | 'more_vert';

  @Input() optionsOverride: RequestRendererOptionsState;

  constructor(private reportDialog: ReportDialog,
              private activatedSeason: ActivatedSeason,
              private router: Router) {}
  openEditNameDialog() {
    this.reportDialog.editReport(this.report);
  }

  print() {
    this.router.navigate([`${this.activatedSeason.season.value}/print`, {
      options: JSON.stringify(this.optionsOverride || this.report.options),
      title: this.report.name
    }]);
  }

  deleteReport() {
    this.reportDialog.deleteReport(this.report);
  }
}
