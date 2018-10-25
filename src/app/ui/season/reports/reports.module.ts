import {NgModule} from '@angular/core';
import {ReportsComponent} from './reports.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from 'app/pipe/pipe.module';
import {RouterModule} from '@angular/router';
import {ReportMenuModule} from 'app/ui/season/shared/report-menu/report-menu.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    PipeModule,
    ReportMenuModule
  ],
  declarations: [ReportsComponent],
  exports: [ReportsComponent],
})
export class ReportsModule { }
