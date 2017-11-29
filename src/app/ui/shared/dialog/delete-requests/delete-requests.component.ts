import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-delete-requests',
  templateUrl: './delete-requests.component.html',
  styleUrls: ['./delete-requests.component.scss']
})
export class DeleteRequestsComponent {
  _onDelete: Subject<void> = new Subject<void>();
  requests: string[];

  constructor(private dialogRef: MatDialogRef<DeleteRequestsComponent>) { }

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
