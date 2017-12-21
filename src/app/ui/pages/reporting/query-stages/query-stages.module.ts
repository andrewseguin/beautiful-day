import {NgModule} from '@angular/core';
import {QueryStagesComponent} from './query-stages.component';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [QueryStagesComponent],
  exports: [QueryStagesComponent],
})
export class QueryStagesModule { }
