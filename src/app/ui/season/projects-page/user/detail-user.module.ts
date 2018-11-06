import {NgModule} from '@angular/core';
import {DetailUser} from './detail-user';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [DetailUser],
  exports: [DetailUser],
})
export class DetailUserModule { }
