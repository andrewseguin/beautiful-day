import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditStatus} from 'app/ui/season/shared/dialog/request/edit-status/edit-status';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditStatus],
  exports: [EditStatus],
  entryComponents: [EditStatus]
})
export class EditStatusModule { }

