import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  templateUrl: 'report-delete.html',
})
export class ReportDelete {
  name: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = data['name'];
  }
}
