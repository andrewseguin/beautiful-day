import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReportMenu} from 'app/season/shared/report-menu/report-menu';
import {CommonModule} from '@angular/common';
import {ReportDialogModule} from 'app/season/shared/dialog/report/report-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReportDialogModule,
  ],
  declarations: [ReportMenu],
  exports: [ReportMenu],
})
export class ReportMenuModule { }
