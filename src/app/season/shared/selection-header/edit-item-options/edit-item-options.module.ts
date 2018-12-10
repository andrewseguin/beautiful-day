import {NgModule} from '@angular/core';
import {EditItemOptions} from './edit-item-options';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {ItemDialogModule} from 'app/season/shared/dialog/item/item-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ItemDialogModule,
  ],
  declarations: [EditItemOptions],
  exports: [EditItemOptions],
})
export class EditItemOptionsModule { }
