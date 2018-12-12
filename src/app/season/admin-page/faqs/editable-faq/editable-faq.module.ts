import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {EditableFaq} from './editable-faq';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [EditableFaq],
  exports: [EditableFaq],
})
export class EditableFaqModule { }
