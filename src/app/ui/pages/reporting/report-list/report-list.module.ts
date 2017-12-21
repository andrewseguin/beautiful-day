import {NgModule} from '@angular/core';
import {ReportListComponent} from './report-list.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PipeModule} from 'app/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    MaterialModule,
  ],
  declarations: [ReportListComponent],
  exports: [ReportListComponent],
})
export class ReportListModule { }
