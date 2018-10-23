import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {HeaderModule} from './shared//header/header.module';
import {RouterModule} from '@angular/router';
import {ProjectModule} from './project/project.module';
import {InventoryModule} from './inventory/inventory.module';
import {ProjectsModule} from './projects/projects.module';
import {EventsModule} from './events/events.module';
import {ReportsModule} from './reports/reports.module';
import {DialogModule} from 'app/ui/pages/shared/dialog/dialog.module';
import {AdminModule} from './admin/admin.module';
import {HelpModule} from './help/help.module';
import {ReportModule} from 'app/ui/pages/report/report.module';

@NgModule({
  imports: [
    MaterialModule,
    NavModule,
    AdminModule,
    HeaderModule,
    SelectionHeaderModule,
    RouterModule,
    ProjectModule,
    InventoryModule,
    ProjectsModule,
    ReportsModule,
    ReportModule,
    EventsModule,
    DialogModule,
    HelpModule,
  ],
  declarations: [PagesComponent],
  exports: [PagesComponent],
})
export class PagesModule { }
