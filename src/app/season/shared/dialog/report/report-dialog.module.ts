import {NgModule} from '@angular/core';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {ReportDialog} from './report-dialog';
import {ReportEditModule} from './report-edit/report-edit.module';

@NgModule({
  imports: [
    DeleteConfirmationModule,
    ReportEditModule,
  ],
  providers: [ReportDialog]
})
export class ReportDialogModule { }
