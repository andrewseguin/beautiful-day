import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Item} from 'app/model/item';
import {Project} from 'app/model/project';
import {Request} from 'app/model/request';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {PromptDialogComponent} from 'app/ui/pages/shared/dialog/prompt-dialog/prompt-dialog.component';
import {AngularFireDatabase} from '@angular/fire/database';
import {DaoService} from './dao-service';
import {SelectionModel} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {takeUntil} from 'rxjs/operators';

export class RequestAddedResponse {
  item: Item;
  key: string;
}

@Injectable()
export class RequestsService extends DaoService<Request> implements OnDestroy {
  requestAdded = new Subject<RequestAddedResponse>();
  requests = new BehaviorSubject<Request[]>([]);

  selection = new SelectionModel<string>(true);

  requestsByItem = new BehaviorSubject<Map<string, Request[]>>(new Map());

  private destroyed = new Subject();

  constructor(protected db: AngularFireDatabase,
              private router: Router,
              private mdDialog: MatDialog) {
    super(db, 'requests');
    this.getKeyedListDao().pipe(takeUntil(this.destroyed)).subscribe(requests => {
      this.requests.next(requests);

      const requestsByItem = new Map<string, Request[]>();
      requests.forEach(request => {
        const currentRequestSet = requestsByItem.get(request.item) || [];
        currentRequestSet.push(request);
        requestsByItem.set(request.item, currentRequestSet);
      });
      this.requestsByItem.next(requestsByItem);
    });

    // Clear selected requests when route changes.
    this.router.events.subscribe(() => this.selection.clear());
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getProjectRequests(projectId: string): Observable<Request[]> {
    const queryFn = ref => ref.orderByChild('project').equalTo(projectId);
    return this.queryList(queryFn);
  }

  addRequest(project: Project, item: Item, quantity = 1) {
    const defaultDate = 1524812400000; // Hard-coded April 27, 2018

    const request: Request = {
      item: item.$key,
      project: project.$key,
      quantity: quantity,
      note: '',
      dropoff: 'Westgate Gym',
      date: Number(project.lastUsedDate || defaultDate)
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
}
