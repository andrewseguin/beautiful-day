import {NgModule} from '@angular/core';
import {HeaderComponent} from './header.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule { }
