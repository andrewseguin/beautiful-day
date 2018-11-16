import {NgModule} from '@angular/core';
import {DisplayOptionsHeader} from './display-options-header';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [DisplayOptionsHeader],
  exports: [DisplayOptionsHeader]
})
export class DisplayOptionsHeaderModule { }
