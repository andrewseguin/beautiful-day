import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {PromptDialogModule} from '../prompt-dialog/prompt-dialog.module';
import {EditDropoffModule} from './edit-dropoff/edit-dropoff.module';
import {EditTagsModule} from './edit-tags/edit-tags.module';
import {EditStatusModule} from './edit-status/edit-status.module';
import {DeleteConfirmationModule} from '../delete-confirmation/delete-confirmation.module';
import {RequestDialog} from './request-dialog';

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
