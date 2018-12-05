import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {AdvancedSearch} from './advanced-search';
import {DateQueryFormModule} from './form/date-query-form/date-query-form.module';
import {InputQueryFormModule} from './form/input-query-form/input-query-form.module';
import {NumberQueryFormModule} from './form/number-query-form/number-query-form.module';
import {StateQueryFormModule} from './form/state-query-form/state-query-form.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DateQueryFormModule,
    InputQueryFormModule,
    NumberQueryFormModule,
    StateQueryFormModule,
  ],
  declarations: [AdvancedSearch],
  exports: [AdvancedSearch]
})
export class AdvancedSearchModule { }

