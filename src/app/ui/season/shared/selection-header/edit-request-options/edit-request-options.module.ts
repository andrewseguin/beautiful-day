import {NgModule} from '@angular/core';
import {EditRequestOptionsComponent} from './edit-request-options.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestDialogModule} from 'app/ui/season/shared/dialog/request/request-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestDialogModule
  ],
  declarations: [EditRequestOptionsComponent],
  exports: [EditRequestOptionsComponent],
})
export class EditRequestOptionsModule { }
