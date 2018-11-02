import {NgModule} from '@angular/core';
import {RequestsGroup} from './requests-group';
import {CommonModule} from '@angular/common';
import {RequestViewModule} from '../request-view/request-view.module';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    RequestViewModule,
    CommonModule,
    MaterialModule,
  ],
  declarations: [RequestsGroup],
  exports: [RequestsGroup]
})
export class RequestsGroupModule { }
