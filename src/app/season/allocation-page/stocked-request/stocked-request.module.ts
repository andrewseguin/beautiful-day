import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'app/material.module';
import {ViewRequestModule} from 'app/season/shared/dialog/request/view-request/view-request.module';

import {StockedRequest} from './stocked-request';

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    ViewRequestModule,
  ],
  declarations: [StockedRequest],
  exports: [StockedRequest],
})
export class StockedRequestModule {
}
