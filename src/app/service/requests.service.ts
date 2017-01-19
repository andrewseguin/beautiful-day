import {Injectable} from "@angular/core";
import {FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase} from "angularfire2";
import {Router} from "@angular/router";
import {Item} from "../model/item";
import {Project} from "../model/project";
import {Request} from "../model/request";
import {Subject, Observable} from "rxjs";
import {MdSnackBar, MdDialog} from "@angular/material";
import {PromptDialogComponent} from "../ui/shared/dialog/prompt-dialog/prompt-dialog.component";

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
              private mdDialog: MdDialog,
              private snackBar: MdSnackBar) {
    // Clear selected requests when route changes.
    this.router.events.subscribe(() => this.clearSelected());
  }

  getAllRequests(): FirebaseListObservable<Request[]> {
    return this.db.list('requests');
  }

  getProjectRequests(projectId: string): FirebaseListObservable<Request[]> {
    return this.db.list('requests', {
      query: {
        orderByChild: 'project',
        equalTo: projectId
      }
    });
  }

  getRequest(id: string): FirebaseObjectObservable<Request> {
    return this.db.object(`requests/${id}`);
  }

  removeRequest(id: string): void {
    this.getAllRequests().remove(id);
  }

  addRequest(project: Project, item: Item, quantity: number = 1) {
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
    this.getRequest(id).update(update);
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
    if (requestIds.size == 1) {
      requestIds.forEach(id => {
        this.getRequest(id).subscribe(request => {
          dialogRef.componentInstance.input = request.note;
        })
      });
    }

    dialogRef.componentInstance.onSave().subscribe(note => {
      requestIds.forEach(requestId => this.update(requestId, {note}));
      this.clearSelected();
    })
  }

  removeAllRequests() {
    this.db.object('requests').set(null);
  }
}
