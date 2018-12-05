import {NgModule} from '@angular/core';
import {RequestsList} from './requests-list';
import {CommonModule} from '@angular/common';
import {RequestsGroupModule} from './requests-group/requests-group.module';
import {DisplayOptionsHeaderModule} from './display-options-header/display-options-header.module';
import {MaterialModule} from 'app/material.module';
import {AdvancedSearchModule} from '../advanced-search/advanced-search.module';
import {LoadingModule} from '../loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestsGroupModule,
    DisplayOptionsHeaderModule,
    AdvancedSearchModule,
    LoadingModule,
  ],
  declarations: [RequestsList],
  exports: [RequestsList],
})
export class RequestsListModule { }
