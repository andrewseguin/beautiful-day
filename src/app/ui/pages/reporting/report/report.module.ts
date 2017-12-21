import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/ui/shared/requests-list/requests-list.module';
import {QueryStagesModule} from 'app/ui/pages/reporting/query-stages/query-stages.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestsListModule,
    QueryStagesModule,
  ],
  declarations: [ReportComponent],
  exports: [ReportComponent],
})
export class ReportModule { }
