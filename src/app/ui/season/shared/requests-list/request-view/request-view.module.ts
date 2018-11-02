import {NgModule} from '@angular/core';
import {RequestView} from './request-view';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestDialogModule} from 'app/ui/season/shared/dialog/request/request-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestDialogModule,
  ],
  declarations: [RequestView],
  exports: [RequestView],
})
export class RequestViewModule { }
