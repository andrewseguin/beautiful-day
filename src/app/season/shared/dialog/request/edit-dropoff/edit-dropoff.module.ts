import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {EditDropoff} from 'app/season/shared/dialog/request/edit-dropoff/edit-dropoff';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [EditDropoff],
  exports: [EditDropoff],
  entryComponents: [EditDropoff]
})
export class EditDropoffModule { }

