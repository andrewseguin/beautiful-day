import {SelectionHeader} from './selection-header';
import {NgModule} from '@angular/core';
import {EditRequestOptionsModule} from './edit-request-options/edit-request-options.module';
import {EditItemOptionsModule} from './edit-item-options/edit-item-options.module';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    EditItemOptionsModule,
    EditRequestOptionsModule,
  ],
  declarations: [SelectionHeader],
  exports: [SelectionHeader],
})
export class SelectionHeaderModule { }
