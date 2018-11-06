import {NgModule} from '@angular/core';
import {ReportsPage} from './reports-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ReportMenuModule} from 'app/season/shared/report-menu/report-menu.module';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReportMenuModule,
    RouteGuardModule,
  ],
  declarations: [ReportsPage],
  exports: [ReportsPage],
})
export class ReportsPageModule { }
