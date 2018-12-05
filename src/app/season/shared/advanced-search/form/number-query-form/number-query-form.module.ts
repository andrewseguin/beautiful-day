import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NumberQueryForm} from './number-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [NumberQueryForm],
  exports: [NumberQueryForm]
})
export class NumberQueryFormModule { }
