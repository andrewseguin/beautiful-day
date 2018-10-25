import {NgModule} from '@angular/core';
import {Loading} from './loading';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [MaterialModule],
  declarations: [Loading],
  exports: [Loading],
})
export class LoadingModule { }
