import {NgModule} from '@angular/core';
import {EventsPage} from './events-page';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {LoadingModule} from '../shared/loading/loading.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: EventsPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class EventsPageRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoadingModule,
    EventsPageRoutingModule
  ],
  declarations: [EventsPage],
  exports: [EventsPage],
})
export class EventsPageModule { }
