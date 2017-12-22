import {NgModule} from '@angular/core';
import {RequestComponent} from './request.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [RequestComponent],
  exports: [RequestComponent],
})
export class RequestModule { }
