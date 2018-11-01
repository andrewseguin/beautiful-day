import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReportMenu} from 'app/ui/season/shared/report-menu/report-menu';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ReportMenu],
  exports: [ReportMenu],
})
export class ReportMenuModule { }
