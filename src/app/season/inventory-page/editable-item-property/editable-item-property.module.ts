import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditableItemProperty} from './editable-item-property';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [EditableItemProperty],
  exports: [EditableItemProperty],
})
export class EditableItemPropertyModule { }
