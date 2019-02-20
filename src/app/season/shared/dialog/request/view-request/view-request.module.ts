import {NgModule} from '@angular/core';
import {ViewRequest} from './view-request';
import {RequestViewModule} from 'app/season/shared/requests-list/request-view/request-view.module';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    MaterialModule,
    RequestViewModule,
  ],
  declarations: [ViewRequest],
  exports: [ViewRequest],
  entryComponents: [ViewRequest]
})
export class ViewRequestModule { }
