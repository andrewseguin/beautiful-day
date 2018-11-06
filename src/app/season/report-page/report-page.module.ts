import {NgModule} from '@angular/core';
import {ReportPage} from './report-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/season/shared/requests-list/requests-list.module';
import {DialogModule} from 'app/season/shared/dialog/dialog.module';
import {ReportMenuModule} from 'app/season/shared/report-menu/report-menu.module';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: ReportPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ReportPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    MaterialModule,
    RequestsListModule,
    ReportMenuModule,
    RouteGuardModule,
    ReportPageRoutingModule
  ],
  declarations: [ReportPage],
  exports: [ReportPage],
})

export class ReportPageModule { }
