import {NgModule} from '@angular/core';
import {EditItemOptionsComponent} from './edit-item-options.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [EditItemOptionsComponent],
  exports: [EditItemOptionsComponent],
})
export class EditItemOptionsModule { }
