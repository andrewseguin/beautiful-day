import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {StateQueryForm} from './state-query-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [StateQueryForm],
  exports: [StateQueryForm]
})
export class StateQueryFormModule { }
