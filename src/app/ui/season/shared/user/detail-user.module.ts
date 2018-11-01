import {NgModule} from '@angular/core';
import {DetailUser} from './detail-user';
import {CommonModule} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSlideToggleModule,
  ],
  declarations: [DetailUser],
  exports: [DetailUser],
})
export class DetailUserModule { }
