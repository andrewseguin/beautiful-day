import {NgModule} from '@angular/core';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ItemDialog} from './item-dialog';
import {CreateItemModule} from './create-item/create-item.module';
import {EditItemStatusModule} from './edit-item-status/edit-item-status.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    CreateItemModule,
    EditItemStatusModule
  ],
  providers: [ItemDialog]
})
export class ItemDialogModule { }
