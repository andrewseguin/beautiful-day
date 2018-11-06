import {NgModule} from '@angular/core';
import {Events} from './events';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableEventModule} from './editable-event/editable-event.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    EditableEventModule,
  ],
  declarations: [Events],
  exports: [Events],
})
export class EventsModule { }
