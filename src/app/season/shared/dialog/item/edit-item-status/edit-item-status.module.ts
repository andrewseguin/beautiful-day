import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditItemStatus} from './edit-item-status';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditItemStatus],
  exports: [EditItemStatus],
  entryComponents: [EditItemStatus]
})
export class EditItemStatusModule { }

