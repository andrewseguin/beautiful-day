import {NgModule} from '@angular/core';
import {RequestFilterComponent} from './request-filter.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  declarations: [RequestFilterComponent],
  exports: [RequestFilterComponent]
})
export class RequestFilterModule { }
