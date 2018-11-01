import {NgModule} from '@angular/core';
import {EditRequestOptions} from './edit-request-options';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestDialogModule} from 'app/ui/season/shared/dialog/request/request-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestDialogModule
  ],
  declarations: [EditRequestOptions],
  exports: [EditRequestOptions],
})
export class EditRequestOptionsModule { }
