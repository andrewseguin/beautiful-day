import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Item} from '../model/item';
import {Project} from '../model/project';
import {Request} from '../model/request';
import {Subject, Observable} from 'rxjs';
import {MatDialog} from '@angular/material';
import {PromptDialogComponent} from '../ui/shared/dialog/prompt-dialog/prompt-dialog.component';
import {
  AngularFireDatabase, AngularFireList
} from 'angularfire2/database';
import {transformSnapshotActionList, transformSnapshotAction} from '../utility/snapshot-tranform';

export class RequestAddedResponse {
  item: Item;
  key: string;
}

@Injectable()
export class RequestsService {
  requestAdded = new Subject<RequestAddedResponse>();
  selectedRequests = new Set<string>();
  selectionChangeSubject = new Subject<void>();

  constructor(private db: AngularFireDatabase,
              private router: Router,
              private mdDialog: MatDialog) {
    // Clear selected requests when route changes.
    this.router.events.subscribe(() => this.clearSelected());
  }

  getAllRequests(): AngularFireList<Request[]> {
    return this.db.list('requests');
  }

  getProjectRequests(projectId: string): Observable<Request[]> {
    if (projectId === 'all') {
      return this.getAllRequests().snapshotChanges().map(transformSnapshotActionList);
    }

    return this.db.list('requests', ref => ref.orderByChild('project').equalTo(projectId)).snapshotChanges().map(transformSnapshotActionList);
  }

  getRequest(id: string): Observable<Request> {
    return this.db.object(`requests/${id}`).snapshotChanges().map(transformSnapshotAction);
  }

  removeRequest(id: string): void {
    this.db.list(`requests`).remove(id);
  }

  addRequest(project: Project, item: Item, quantity = 1) {
    const defaultDate = new Date(1491030000000); // Hard-coded April 1, 2017

    this.db.list('requests').push({
      item: item.$key,
      project: project.$key,
      quantity: quantity,
      note: '',
      dropoff: 'Westgate Gym',
      date: project.lastUsedDate || defaultDate.getTime()
    }).then(response => {
      this.requestAdded.next({key: response.getKey(), item});
    });
  }

  getRequestAddedStream(): Observable<RequestAddedResponse> {
    return this.requestAdded.asObservable();
  }

  update(id: string, update: any) {
    this.db.object(`requests/${id}`).update(update);
  }

  selectionChange(): Observable<void> {
    return this.selectionChangeSubject.asObservable();
  }

  setSelected(id: string, value: boolean) {
    if (value) {
      this.selectedRequests.add(id);
    } else {
      this.selectedRequests.delete(id);
    }

    this.selectionChangeSubject.next();
  }

  isSelected(id: string): boolean {
    return this.selectedRequests.has(id);
  }

  clearSelected() {
    this.selectedRequests = new Set();
    this.selectionChangeSubject.next();
  }

  getSelectedRequests(): Set<string> {
    return this.selectedRequests;
  }

  editNote(requestIds: Set<string>) {
    const dialogRef = this.mdDialog.open(PromptDialogComponent);

    dialogRef.componentInstance.title = 'Edit Note';
    if (requestIds.size === 1) {
      requestIds.forEach(id => {
        this.getRequest(id).subscribe(request => {
          dialogRef.componentInstance.input = request.note;
        });
      });
    }

    dialogRef.componentInstance.onSave().subscribe(note => {
      requestIds.forEach(requestId => this.update(requestId, {note}));
      this.clearSelected();
    });
  }

  removeAllRequests() {
    this.db.object('requests').set(null);
  }
}
