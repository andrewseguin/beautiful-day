import {NgModule} from '@angular/core';
import {DisplayOptionsHeader} from './display-options-header';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {RequestFilterModule} from '../requests-search/request-filter/request-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RequestFilterModule,
  ],
  declarations: [DisplayOptionsHeader],
  exports: [DisplayOptionsHeader]
})
export class DisplayOptionsHeaderModule { }
