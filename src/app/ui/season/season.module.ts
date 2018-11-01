import {NgModule} from '@angular/core';
import {Season} from './season';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {RouterModule} from '@angular/router';
import {ProjectPageModule} from './project/project-page.module';
import {InventoryModule} from './inventory/inventory.module';
import {ProjectsPageModule} from './projects/projects-page.module';
import {EventsModule} from './events/events.module';
import {ReportsPageModule} from './reports/reports-page.module';
import {DialogModule} from 'app/ui/season/shared/dialog/dialog.module';
import {AdminModule} from './admin/admin.module';
import {HelpModule} from './help/help.module';
import {ReportPageModule} from 'app/ui/season/report/report-page.module';
import {Accounting, Header, Permissions, Selection, ActivatedSeason} from './services';
import {DaoModule} from './dao';
import {SeasonHeaderModule} from './shared/header/season-header.module';

@NgModule({
  imports: [
    MaterialModule,
    NavModule,
    AdminModule,
    SeasonHeaderModule,
    SelectionHeaderModule,
    RouterModule,
    ProjectPageModule,
    InventoryModule,
    ProjectsPageModule,
    ReportsPageModule,
    ReportPageModule,
    EventsModule,
    DialogModule,
    HelpModule,
    DaoModule,
  ],
  declarations: [Season],
  exports: [Season],
  providers: [
    Accounting,
    Selection,
    Permissions,
    Header,
    ActivatedSeason,
  ]
})
export class SeasonModule { }
