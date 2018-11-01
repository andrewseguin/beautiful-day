import {NgModule} from '@angular/core';
import {Nav} from './nav';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [Nav],
  exports: [Nav],
})
export class NavModule { }
