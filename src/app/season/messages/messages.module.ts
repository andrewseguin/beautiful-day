import {NgModule} from '@angular/core';
import {Messages} from './messages';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [Messages],
  exports: [Messages],
})
export class MessagesModule { }
