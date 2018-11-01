import {NgModule} from '@angular/core';
import {Events} from './events';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {PipeModule} from 'app/pipe/pipe.module';
import {LoadingModule} from '../shared/loading/loading.module';

@NgModule({
  imports: [
    PipeModule,
    CommonModule,
    MaterialModule,
    LoadingModule,
  ],
  declarations: [Events],
  exports: [Events],
})
export class EventsModule { }
