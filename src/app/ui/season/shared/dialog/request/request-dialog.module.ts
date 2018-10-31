import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PromptDialogModule} from 'app/ui/season/shared/dialog/prompt-dialog/prompt-dialog.module';
import {EditDropoffModule} from 'app/ui/season/shared/dialog/request/edit-dropoff/edit-dropoff.module';
import {EditTagsModule} from 'app/ui/season/shared/dialog/request/edit-tags/edit-tags.module';
import {EditStatusModule} from 'app/ui/season/shared/dialog/request/edit-status/edit-status.module';
import {DeleteConfirmationModule} from 'app/ui/season/shared/dialog/delete-confirmation/delete-confirmation.module';
import {RequestDialog} from 'app/ui/season/shared/dialog/request/request-dialog';

@NgModule({
  imports: [
    CommonModule,
    DeleteConfirmationModule,
    EditDropoffModule,
    EditStatusModule,
    EditTagsModule,
    MaterialModule,
    PromptDialogModule,
    ReactiveFormsModule,
  ],
  providers: [RequestDialog]
})
export class RequestDialogModule { }
