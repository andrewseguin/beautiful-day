import {NgModule} from '@angular/core';
import {PromptDialogModule} from '../prompt-dialog/prompt-dialog.module';
import {EditDropoffModule} from './edit-dropoff/edit-dropoff.module';
import {EditTagsModule} from './edit-tags/edit-tags.module';
import {EditStatusModule} from './edit-status/edit-status.module';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {RequestDialog} from './request-dialog';
import {EditCostAdjustmentModule} from 'app/season/shared/dialog/request/edit-cost-adjustment/edit-cost-adjustment.module';

@NgModule({
  imports: [
    DeleteConfirmationModule,
    EditDropoffModule,
    EditStatusModule,
    EditCostAdjustmentModule,
    EditTagsModule,
    PromptDialogModule,
  ],
  providers: [RequestDialog]
})
export class RequestDialogModule { }
