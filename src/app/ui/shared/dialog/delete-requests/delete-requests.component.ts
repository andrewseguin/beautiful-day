import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs';
import {NotesService} from '../../../../service/notes.service';

@Component({
  selector: 'app-delete-requests',
  templateUrl: './delete-requests.component.html',
  styleUrls: ['./delete-requests.component.scss']
})
export class DeleteRequestsComponent {
  _onDelete: Subject<void> = new Subject<void>();
  requests: Set<string>;

  constructor(private dialogRef: MdDialogRef<DeleteRequestsComponent>) { }

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
