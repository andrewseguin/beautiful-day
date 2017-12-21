import {NgModule} from '@angular/core';
import {EditRequestOptionsComponent} from './edit-request-options.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [EditRequestOptionsComponent],
  exports: [EditRequestOptionsComponent],
})
export class EditRequestOptionsModule { }
