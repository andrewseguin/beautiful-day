import {NgModule} from '@angular/core';
import {
  ReportEdit
} from 'app/ui/season/shared/dialog/report-edit/report-edit';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [ReportEdit],
  exports: [ReportEdit],
  entryComponents: [ReportEdit]
})
export class ReportEditModule { }

