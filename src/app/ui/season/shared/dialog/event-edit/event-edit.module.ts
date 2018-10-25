import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {EventEdit} from 'app/ui/season/shared/dialog/event-edit/event-edit';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EventEdit],
  exports: [EventEdit],
  entryComponents: [EventEdit]
})
export class EventEditModule { }

