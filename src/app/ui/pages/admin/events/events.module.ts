import {NgModule} from '@angular/core';
import {Events} from './events';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [Events],
  exports: [Events],
})
export class EventsModule { }
