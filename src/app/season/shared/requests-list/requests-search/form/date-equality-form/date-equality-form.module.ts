import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DateEqualityForm} from './date-equality-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [DateEqualityForm],
  exports: [DateEqualityForm]
})
export class DateEqualityFormModule { }
