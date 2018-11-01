import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReportDelete} from 'app/ui/season/shared/dialog/report-delete/report-delete';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [ReportDelete],
  exports: [ReportDelete],
  entryComponents: [ReportDelete]
})
export class ReportDeleteModule { }

