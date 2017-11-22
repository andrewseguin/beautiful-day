import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Item} from '../model/item';
import {Project} from '../model/project';
import {Request} from '../model/request';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {PromptDialogComponent} from '../ui/shared/dialog/prompt-dialog/prompt-dialog.component';
import {AngularFireDatabase} from 'angularfire2/database';
import {DaoService} from './dao-service';
import {SelectionModel} from '@angular/cdk/collections';

export class RequestAddedResponse {
  item: Item;
  key: string;
}

@Injectable()
export class RequestsService extends DaoService<Request> {
  requestAdded = new Subject<RequestAddedResponse>();
  requests: Observable<Request[]>;
  selection = new SelectionModel<string>(true);

  constructor(protected db: AngularFireDatabase,
              private router: Router,
              private mdDialog: MatDialog) {
    super(db, 'requests');
    this.requests = this.getKeyedListDao();

    // Clear selected requests when route changes.
    this.router.events.subscribe(() => this.selection.clear());
  }

  getProjectRequests(projectId: string): Observable<Request[]> {
    const queryFn = ref => ref.orderByChild('project').equalTo(projectId);
    return this.queryList(queryFn);
  }

  addRequest(project: Project, item: Item, quantity = 1) {
    const defaultDate = new Date(1491030000000); // Hard-coded April 1, 2017

    const request: Request = {
      item: item.$key,
      project: project.$key,
      quantity: quantity,
      note: '',
      dropoff: 'Westgate Gym',
      date: (project.lastUsedDate || defaultDate.getTime()).toString()
    };
    this.add(request).then(response => {
      this.requestAdded.next({key: response.getKey(), item});
    });
  }

  getRequestAddedStream(): Observable<RequestAddedResponse> {
    return this.requestAdded.asObservable();
  }

  editNote(requestIds: string[]) {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Edit Note';
    if (requestIds.length === 1) {
      requestIds.forEach(id => {
        this.get(id).subscribe(request => {
          dialogRef.componentInstance.input = request.note;
        });
      });
    }

    dialogRef.componentInstance.onSave().subscribe(note => {
      requestIds.forEach(requestId => this.update(requestId, {note: <string>note}));
      this.selection.clear();
    });
  }

  removeAllRequests() {
    this.db.object(this.ref).set(null);
  }
}
