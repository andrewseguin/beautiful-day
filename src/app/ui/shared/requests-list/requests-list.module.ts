import {NgModule} from '@angular/core';
import {RequestsListComponent} from './requests-list.component';
import {CommonModule} from '@angular/common';
import {RequestsGroupModule} from './requests-group/requests-group.module';
import {DisplayOptionsHeaderModule} from './display-options-header/display-options-header.module';

@NgModule({
  imports: [
    CommonModule,
    RequestsGroupModule,
    DisplayOptionsHeaderModule,
  ],
  declarations: [RequestsListComponent],
  exports: [RequestsListComponent]
})
export class RequestsListModule { }
