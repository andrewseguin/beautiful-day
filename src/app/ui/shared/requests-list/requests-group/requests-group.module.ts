import {NgModule} from '@angular/core';
import {RequestsGroupComponent} from './requests-group.component';
import {CommonModule} from '@angular/common';
import {RequestModule} from '../request/request.module';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    RequestModule,
    CommonModule,
    MaterialModule,
  ],
  declarations: [RequestsGroupComponent],
  exports: [RequestsGroupComponent]
})
export class RequestsGroupModule { }
