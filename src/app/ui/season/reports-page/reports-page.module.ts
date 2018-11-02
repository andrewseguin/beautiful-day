import {NgModule} from '@angular/core';
import {ReportsPage} from './reports-page';
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
  declarations: [ReportsPage],
  exports: [ReportsPage],
})
export class ReportsPageModule { }
