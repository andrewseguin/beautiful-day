import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NumberEqualityForm} from './number-equality-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [NumberEqualityForm],
  exports: [NumberEqualityForm]
})
export class NumberEqualityFormModule { }
