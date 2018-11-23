import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableMessage} from './editable-message';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [EditableMessage],
  exports: [EditableMessage],
})
export class EditableMessageModule { }
