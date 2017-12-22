import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NavModule} from './shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from './shared/selection-header/selection-header.module';
import {HeaderModule} from './shared//header/header.module';
import {RouterModule} from '@angular/router';
import {ProjectModule} from './project/project.module';
import {InventoryModule} from './inventory/inventory.module';
import {HomeModule} from './home/home.module';
import {FeedbackModule} from './feedback/feedback.module';
import {EventsModule} from './events/events.module';
import {ReportingModule} from './reporting/reporting.module';
import {DialogModule} from 'app/ui/pages/shared/dialog/dialog.module';

@NgModule({
  imports: [
    MaterialModule,
    NavModule,
    HeaderModule,
    SelectionHeaderModule,
    RouterModule,
    ProjectModule,
    InventoryModule,
    HomeModule,
    FeedbackModule,
    ReportingModule,
    EventsModule,
    DialogModule,
  ],
  declarations: [PagesComponent],
  exports: [PagesComponent],
})
export class PagesModule { }
