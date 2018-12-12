import {NgModule} from '@angular/core';
import {Contacts} from './contacts';
import {MaterialModule} from 'app/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {EditableContactModule} from './editable-contact/editable-contact.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    EditableContactModule,
    LoadingModule,
  ],
  declarations: [Contacts],
  exports: [Contacts],
})
export class ContactsModule { }
