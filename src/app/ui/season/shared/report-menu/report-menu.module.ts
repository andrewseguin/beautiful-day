import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReportMenuComponent} from 'app/ui/season/shared/report-menu/report-menu.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [ReportMenuComponent],
  exports: [ReportMenuComponent],
})
export class ReportMenuModule { }
