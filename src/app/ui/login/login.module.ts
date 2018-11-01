import {NgModule} from '@angular/core';
import {Login} from './login';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [Login],
  exports: [Login],
})
export class LoginModule { }
