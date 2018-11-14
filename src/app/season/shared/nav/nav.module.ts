import {NgModule} from '@angular/core';
import {Nav} from './nav';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {UserDialogModule} from 'app/season/shared/dialog/user/user-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    UserDialogModule,
  ],
  declarations: [Nav],
  exports: [Nav],
})
export class NavModule { }
