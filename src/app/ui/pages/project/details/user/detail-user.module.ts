import {NgModule} from '@angular/core';
import {DetailUserComponent} from './detail-user.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DetailUserComponent],
  exports: [DetailUserComponent],
})
export class DetailUserModule { }
