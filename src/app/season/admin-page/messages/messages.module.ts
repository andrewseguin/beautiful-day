import {NgModule} from '@angular/core';
import {Messages} from './messages';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableMessageModule} from './editable-message/editable-message.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    EditableMessageModule,
    LoadingModule,
  ],
  declarations: [Messages],
  exports: [Messages],
})
export class MessagesModule { }
