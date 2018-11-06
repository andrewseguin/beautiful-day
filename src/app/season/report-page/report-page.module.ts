import {NgModule} from '@angular/core';
import {ReportPage} from './report-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/season/shared/requests-list/requests-list.module';
import {DialogModule} from 'app/season/shared/dialog/dialog.module';
import {ReportMenuModule} from 'app/season/shared/report-menu/report-menu.module';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    MaterialModule,
    RequestsListModule,
    ReportMenuModule,
    RouteGuardModule,
  ],
  declarations: [ReportPage],
  exports: [ReportPage],
})

export class ReportPageModule { }
