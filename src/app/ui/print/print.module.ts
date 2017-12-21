import {PrintComponent} from './print.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RequestsListModule} from 'app/ui/shared/requests-list/requests-list.module';

@NgModule({
  imports: [
    CommonModule,
    RequestsListModule,
  ],
  declarations: [PrintComponent]
})
export class PrintModule { }
