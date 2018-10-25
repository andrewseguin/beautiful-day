import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/ui/season/shared/requests-list/requests-list.module';
import {ReportDeleteModule} from 'app/ui/season/shared/dialog/report-delete/report-delete.module';
import {DialogModule} from 'app/ui/season/shared/dialog/dialog.module';
import {ReportMenuModule} from 'app/ui/season/shared/report-menu/report-menu.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    MaterialModule,
    RequestsListModule,
    ReportDeleteModule,
    ReportMenuModule,
  ],
  declarations: [ReportComponent],
  exports: [ReportComponent],
})

export class ReportModule { }
