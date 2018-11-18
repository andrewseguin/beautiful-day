import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DateQueryForm} from './date-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [DateQueryForm],
  exports: [DateQueryForm]
})
export class DateQueryFormModule { }
