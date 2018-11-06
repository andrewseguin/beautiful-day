import {NgModule} from '@angular/core';
import {Season} from './season';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {RouterModule} from '@angular/router';
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
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {CanActivateAcquisitionsGuard} from 'app/season/season.routes';

@NgModule({
  imports: [
    MaterialModule,
    AngularFirestoreModule,
    NavModule,
    SeasonHeaderModule,
    SelectionHeaderModule,
    RouterModule,
    DialogModule,
    DaoModule,
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
