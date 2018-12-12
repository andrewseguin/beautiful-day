import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {LoadingModule} from 'app/season/shared/loading/loading.module';
import {EditableFaqModule} from './editable-faq/editable-faq.module';
import {Faqs} from './faqs';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    EditableFaqModule,
    LoadingModule,
  ],
  declarations: [Faqs],
  exports: [Faqs],
})
export class FaqsModule { }
