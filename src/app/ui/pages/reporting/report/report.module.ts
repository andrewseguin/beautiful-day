import {NgModule} from '@angular/core';
import {ReportComponent} from './report.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestsListModule} from 'app/ui/pages/shared/requests-list/requests-list.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestsListModule,
  ],
  declarations: [ReportComponent],
  exports: [ReportComponent],
})
export class ReportModule { }
