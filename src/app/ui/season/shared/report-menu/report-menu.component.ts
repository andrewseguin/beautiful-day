import {Component, Input} from '@angular/core';
import {ReportDialog} from 'app/ui/season/shared/dialog/report.dialog';
import {Report} from 'app/model/report';

@Component({
  selector: 'report-menu',
  templateUrl: 'report-menu.component.html',
  styleUrls: ['report-menu.component.scss']
})
export class ReportMenuComponent {
  @Input() report: Report;

  @Input() icon: 'settings' | 'more_vert';

  constructor(private reportDialog: ReportDialog) {}
  openEditNameDialog() {
    this.reportDialog.editReport(this.report);
  }

  print() {
    // TODO: implement this
    window.open(`print/report/${this.report.id}`, 'print', 'width=650, height=500');
  }

  deleteReport() {
    this.reportDialog.deleteReport(this.report);
  }
}
