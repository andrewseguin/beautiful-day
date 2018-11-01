import {NgModule} from '@angular/core';
import {EditItemOptions} from './edit-item-options';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [EditItemOptions],
  exports: [EditItemOptions],
})
export class EditItemOptionsModule { }
