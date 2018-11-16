import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {RequestsSearch} from './requests-search';
import {DateEqualityFormModule} from './form/date-equality-form/date-equality-form.module';
import {InputQueryFormModule} from './form/input-query-form/input-query-form.module';
import {NumberEqualityFormModule} from './form/number-equality-form/number-equality-form.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DateEqualityFormModule,
    InputQueryFormModule,
    NumberEqualityFormModule,
  ],
  declarations: [RequestsSearch],
  exports: [RequestsSearch]
})
export class RequestsSearchModule { }
