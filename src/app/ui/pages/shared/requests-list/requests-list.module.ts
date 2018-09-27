import {NgModule} from '@angular/core';
import {RequestsListComponent} from './requests-list.component';
import {CommonModule} from '@angular/common';
import {RequestsGroupModule} from './requests-group/requests-group.module';
import {DisplayOptionsHeaderModule} from './display-options-header/display-options-header.module';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestsGroupModule,
    DisplayOptionsHeaderModule,
    ReactiveFormsModule,
  ],
  declarations: [RequestsListComponent],
  exports: [RequestsListComponent]
})
export class RequestsListModule { }
