import {NgModule} from '@angular/core';
import {Season} from './season';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {RouterModule} from '@angular/router';
import {ProjectPageModule} from './project-page/project-page.module';
import {InventoryPageModule} from './inventory-page/inventory-page.module';
import {ProjectsPageModule} from './projects-page/projects-page.module';
import {EventsPageModule} from './events-page/events-page.module';
import {ReportsPageModule} from './reports-page/reports-page.module';
import {DialogModule} from 'app/ui/season/shared/dialog/dialog.module';
import {AdminPageModule} from './admin-page/admin-page.module';
import {HelpPageModule} from './help-page/help-page.module';
import {ReportPageModule} from 'app/ui/season/report-page/report-page.module';
import {Accounting, Header, Permissions, Selection, ActivatedSeason} from './services';
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
import {ExportPageModule} from 'app/ui/season/export-page/export-page.module';
import {AngularFirestoreModule} from '@angular/fire/firestore';

const PAGE_MODULES: any[] = [
  AdminPageModule,
  ProjectPageModule,
  InventoryPageModule,
  ProjectsPageModule,
  ReportsPageModule,
  ReportPageModule,
  EventsPageModule,
  HelpPageModule,
  ExportPageModule,
];

@NgModule({
  imports: PAGE_MODULES.concat([
    MaterialModule,
    AngularFirestoreModule,
    NavModule,
    SeasonHeaderModule,
    SelectionHeaderModule,
    RouterModule,
    DialogModule,
    DaoModule,
  ]),
  declarations: [Season],
  exports: [Season],
  providers: [
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
