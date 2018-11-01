import {NgModule} from '@angular/core';
import {RequestsGroup} from './requests-group';
import {CommonModule} from '@angular/common';
import {RequestModule} from '../request/request.module';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    RequestModule,
    CommonModule,
    MaterialModule,
  ],
  declarations: [RequestsGroup],
  exports: [RequestsGroup]
})
export class RequestsGroupModule { }
