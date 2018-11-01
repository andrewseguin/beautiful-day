import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-delete-requests',
  templateUrl: 'delete-requests.html',
  styleUrls: ['delete-requests.scss']
})
export class DeleteRequests {
  _onDelete: Subject<void> = new Subject<void>();
  requests: string[];

  constructor(private dialogRef: MatDialogRef<DeleteRequests>) { }

  close() {
    this.dialogRef.close();
  }

  deleteRequests() {
    this._onDelete.next();
    this.close();
  }

  onDelete(): Observable<void> {
    return this._onDelete.asObservable();
  }
}
