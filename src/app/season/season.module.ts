import {NgModule} from '@angular/core';
import {Season} from './season';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {RouterModule, Routes} from '@angular/router';
import {DialogModule} from 'app/season/shared/dialog/dialog.module';
import {Accounting, ActivatedSeason, Header, Permissions, Selection} from './services';
import {
  ConfigDao,
  DaoModule,
  EventsDao,
  GroupsDao,
  ItemsDao,
  ProjectsDao,
  ReportsDao,
  RequestsDao
} from './dao';
import {SeasonHeaderModule} from './shared/header/season-header.module';
import {CanActivateAcquisitionsGuard, SEASON_ROUTES} from 'app/season/season.routes';
import {CommonModule} from '@angular/common';

const routes: Routes = [{path: '', component: Season, children: SEASON_ROUTES}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class SeasonRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    NavModule,
    SeasonHeaderModule,
    SelectionHeaderModule,
    RouterModule,
    DialogModule,
    DaoModule,
    SeasonRoutingModule
  ],
  declarations: [Season],
  exports: [Season],
  providers: [
    CanActivateAcquisitionsGuard,
    Accounting,
    Selection,
    Permissions,
    Header,
    ActivatedSeason,
    ConfigDao,
    EventsDao,
    GroupsDao,
    ItemsDao,
    ProjectsDao,
    ReportsDao,
    RequestsDao,
  ]
})
export class SeasonModule { }
