import {NgModule} from '@angular/core';
import {DisplayOptionsHeaderComponent} from './display-options-header.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  declarations: [DisplayOptionsHeaderComponent],
  exports: [DisplayOptionsHeaderComponent]
})
export class DisplayOptionsHeaderModule { }
