import {NgModule} from '@angular/core';
import {
  ReportEditComponent
} from 'app/ui/season/shared/dialog/report-edit/report-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [ReportEditComponent],
  exports: [ReportEditComponent],
  entryComponents: [ReportEditComponent]
})
export class ReportEditModule { }

