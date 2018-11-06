import {Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface DeleteConfirmationData {
  name: Observable<string>;
}

@Component({
  templateUrl: 'delete-confirmation.html',
  styleUrls: ['delete-confirmation.scss'],
})
export class DeleteConfirmation {
  name = this.data.name;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData) {}
}
