import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReportDeleteComponent} from 'app/ui/pages/shared/dialog/report-delete/report-delete.component';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [ReportDeleteComponent],
  exports: [ReportDeleteComponent],
  entryComponents: [ReportDeleteComponent]
})
export class ReportDeleteModule { }

