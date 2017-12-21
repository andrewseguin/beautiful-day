import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {NavModule} from 'app/ui/shared/nav/nav.module';
import {MaterialModule} from 'app/material.module';
import {SelectionHeaderModule} from 'app/ui/shared/selection-header/selection-header.module';
import {HeaderModule} from 'app/ui/shared/header/header.module';
import {RouterModule} from '@angular/router';
import {ProjectModule} from './project/project.module';
import {InventoryModule} from './inventory/inventory.module';
import {HomeModule} from './home/home.module';
import {FeedbackModule} from './feedback/feedback.module';
import {EventsModule} from './events/events.module';
import {ReportingModule} from './reporting/reporting.module';

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
  ],
  declarations: [PagesComponent],
  exports: [PagesComponent],
})
export class PagesModule { }
