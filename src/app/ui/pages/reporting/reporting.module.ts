import {NgModule} from '@angular/core';
import {ReportingComponent} from './reporting.component';
import {ReportListModule} from 'app/ui/pages/reporting/report-list/report-list.module';
import {CommonModule} from '@angular/common';
import {ReportModule} from 'app/ui/pages/reporting/report/report.module';

@NgModule({
  imports: [
    CommonModule,
    ReportModule,
    ReportListModule,
  ],
  declarations: [ReportingComponent],
  exports: [ReportingComponent],
})
export class ReportingModule { }
