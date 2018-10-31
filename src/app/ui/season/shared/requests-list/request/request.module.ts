import {NgModule} from '@angular/core';
import {RequestComponent} from './request.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {RequestDialogModule} from 'app/ui/season/shared/dialog/request/request-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RequestDialogModule,
  ],
  declarations: [RequestComponent],
  exports: [RequestComponent],
})
export class RequestModule { }
