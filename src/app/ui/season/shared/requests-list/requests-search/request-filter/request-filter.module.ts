import {NgModule} from '@angular/core';
import {RequestFilter} from './request-filter';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [RequestFilter],
  exports: [RequestFilter]
})
export class RequestFilterModule { }
