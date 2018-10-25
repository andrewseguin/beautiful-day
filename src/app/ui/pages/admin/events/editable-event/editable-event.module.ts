import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableEvent} from 'app/ui/pages/admin/events/editable-event/editable-event';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [EditableEvent],
  exports: [EditableEvent],
})
export class EditableEventModule { }
