import { Injectable } from '@angular/core';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Router} from "@angular/router";
import * as firebase from 'firebase';

import {Item} from "../model/item";
import {Project} from "../model/project";
import {Request} from "../model/request";
import {Subject, Observable} from "rxjs";

export class RequestAddedResponse {
  item: Item;
  key: string;
}

@Injectable()
export class RequestsService {
  requestAdded = new Subject<RequestAddedResponse>();
  selectedRequests = new Set<string>();
  selectionChangeSubject = new Subject<void>();

  constructor(private af: AngularFire,
              private router: Router) {
    // Clear selected requests when route changes.
    this.router.events.subscribe(() => this.clearSelected());
  }

  getAllRequests(): FirebaseListObservable<Request[]> {
    return this.af.database.list('requests');
  }

  getProjectRequests(projectId: string): FirebaseListObservable<Request[]> {
    return this.af.database.list('requests', {
      query: {
        orderByChild: 'project',
        equalTo: projectId
      }
    });
  }

  getRequest(id: string): FirebaseObjectObservable<Request> {
    return this.af.database.object(`requests/${id}`);
  }

  removeRequest(id: string): void {
    this.getAllRequests().remove(id);
  }

  addRequest(project: Project, item: Item, quantity: number = 1) {
    this.af.database.list('requests').push({
      item: item.$key,
      project: project.$key,
      quantity: quantity,
      note: '',
      dropoff: project.lastUsedDropoff || '',
      date: project.lastUsedDate || ''
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
}
