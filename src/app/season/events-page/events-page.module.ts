import {NgModule} from '@angular/core';
import {EventsPage} from './events-page';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {LoadingModule} from '../shared/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    LoadingModule,
  ],
  declarations: [EventsPage],
  exports: [EventsPage],
})
export class EventsPageModule { }
