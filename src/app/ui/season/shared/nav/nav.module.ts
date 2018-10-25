import {NgModule} from '@angular/core';
import {NavComponent} from './nav.component';
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
  declarations: [NavComponent],
  exports: [NavComponent],
})
export class NavModule { }
