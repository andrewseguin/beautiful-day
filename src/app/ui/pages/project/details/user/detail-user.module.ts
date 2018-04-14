import {NgModule} from '@angular/core';
import {DetailUserComponent} from './detail-user.component';
import {CommonModule} from '@angular/common';
import {MatSlideToggleModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatSlideToggleModule,
  ],
  declarations: [DetailUserComponent],
  exports: [DetailUserComponent],
})
export class DetailUserModule { }
