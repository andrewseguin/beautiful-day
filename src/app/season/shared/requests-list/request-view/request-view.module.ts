import {NgModule} from '@angular/core';
import {RequestView} from './request-view';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestDialogModule} from 'app/season/shared/dialog/request/request-dialog.module';
import {GuardEdit} from 'app/season/shared/requests-list/request-view/guard-edit';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RequestDialogModule,
  ],
  declarations: [RequestView, GuardEdit],
  exports: [RequestView],
})
export class RequestViewModule { }
