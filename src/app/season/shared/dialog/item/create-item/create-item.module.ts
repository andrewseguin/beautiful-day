import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {CreateItem} from './create-item';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateItem],
  exports: [CreateItem],
  entryComponents: [CreateItem]
})
export class CreateItemModule { }
