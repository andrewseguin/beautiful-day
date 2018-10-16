import {Component, Input} from '@angular/core';
import {ReportsDialog} from 'app/ui/pages/shared/dialog/reports.dialog';
import {Report} from 'app/model/report';

@Component({
  selector: 'report-menu',
  templateUrl: 'report-menu.component.html',
  styleUrls: ['report-menu.component.scss']
})
export class ReportMenuComponent {
  @Input() report: Report;

  @Input() icon: 'settings' | 'more_vert';

  constructor(private reportsDialog: ReportsDialog) {}
  openEditNameDialog() {
    this.reportsDialog.editReport(this.report);
  }

  print() {
    // TODO: implement this
    window.open(`print/report/${this.report.$key}`, 'print', 'width=650, height=500');
  }

  deleteReport() {
    this.reportsDialog.deleteReport(this.report);
  }
}
