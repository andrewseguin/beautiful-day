import {NgModule} from '@angular/core';
import {RequestsListComponent} from './requests-list.component';
import {CommonModule} from '@angular/common';
import {RequestsGroupModule} from './requests-group/requests-group.module';
import {DisplayOptionsHeaderModule} from './display-options-header/display-options-header.module';
import {MaterialModule} from 'app/material.module';
import {RequestsSearchModule} from 'app/ui/pages/shared/requests-list/requests-search/requests-search.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestsGroupModule,
    DisplayOptionsHeaderModule,
    RequestsSearchModule,
  ],
  declarations: [RequestsListComponent],
  exports: [RequestsListComponent],
})
export class RequestsListModule { }
