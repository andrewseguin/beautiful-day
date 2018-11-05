import {NgModule} from '@angular/core';
import {ReportPage} from './report-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/ui/season/shared/requests-list/requests-list.module';
import {DialogModule} from 'app/ui/season/shared/dialog/dialog.module';
import {ReportMenuModule} from 'app/ui/season/shared/report-menu/report-menu.module';
import {RouteGuardModule} from 'app/ui/season/shared/route-guard/route-guard.module';

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
