import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Item, Request} from 'app/season/dao';
import {RequestsRenderer} from 'app/season/services/requests-renderer/requests-renderer';

export interface ViewRequestData {
  request?: Request;
  item?: Item;
}

@Component({
  templateUrl: 'view-request.html',
  styleUrls: ['view-request.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RequestsRenderer]
})
export class ViewRequest {
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: ViewRequestData,
      private requestsRenderer: RequestsRenderer) {
    // Remove the project from the request, will force it to be non-editable
    // (hacky)
    this.data.request.project = '';

    this.requestsRenderer.initialize();
    this.requestsRenderer.options.showRequester = true;
  }
}
