import {NgModule} from '@angular/core';
import {Season} from './season';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {RouterModule, Routes} from '@angular/router';
import {DialogModule} from './shared/dialog/dialog.module';
import {Accounting, ActivatedSeason, Header, Permissions, Selection} from './services';
import {
  ConfigDao,
  EventsDao,
  GroupsDao,
  ItemsDao,
  MessagesDao,
  ProjectsDao,
  ReportsDao,
  RequestsDao,
  FaqsDao, ContactsDao
} from './dao';
import {SeasonHeaderModule} from './shared/header/season-header.module';
import {SEASON_ROUTES} from './season.routes';
import {CommonModule} from '@angular/common';
import {MessagesModule} from './messages/messages.module';
import { Allocations } from './services/allocations';

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
    SeasonRoutingModule,
    MessagesModule,
  ],
  declarations: [Season],
  exports: [Season],
  providers: [
    Accounting,
    Allocations,
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
    MessagesDao,
    ContactsDao,
    FaqsDao,
  ]
})
export class SeasonModule { }
