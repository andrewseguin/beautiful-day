import {NgModule} from '@angular/core';
import {ReportsComponent} from './reports.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {FormsModule} from '@angular/forms';
import {PipeModule} from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PipeModule,
  ],
  declarations: [ReportsComponent],
  exports: [ReportsComponent],
})
export class ReportsModule { }
