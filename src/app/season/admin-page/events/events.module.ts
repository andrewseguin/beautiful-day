import {NgModule} from '@angular/core';
import {Events} from './events';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableEventModule} from './editable-event/editable-event.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    EditableEventModule,
    LoadingModule,
  ],
  declarations: [Events],
  exports: [Events],
})
export class EventsModule { }
