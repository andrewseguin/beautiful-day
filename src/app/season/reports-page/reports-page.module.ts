import {NgModule} from '@angular/core';
import {ReportsPage} from './reports-page';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ReportMenuModule} from 'app/season/shared/report-menu/report-menu.module';
import {RouteGuardModule} from 'app/season/shared/route-guard/route-guard.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

const routes: Routes = [{path: '', component: ReportsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class ReportsPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReportMenuModule,
    RouteGuardModule,
    ReportsPageRoutingModule,
    LoadingModule,
  ],
  declarations: [ReportsPage],
  exports: [ReportsPage],
})
export class ReportsPageModule { }
