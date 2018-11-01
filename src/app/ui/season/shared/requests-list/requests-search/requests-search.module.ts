import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {RequestFilterModule} from './request-filter/request-filter.module';
import {RequestsSearch} from 'app/ui/season/shared/requests-list/requests-search/requests-search';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestFilterModule,
    ReactiveFormsModule,
  ],
  declarations: [RequestsSearch],
  exports: [RequestsSearch]
})
export class RequestsSearchModule { }
