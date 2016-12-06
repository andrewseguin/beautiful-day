import { Injectable } from '@angular/core';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Item} from "../model/item";
import {Project} from "../model/project";
import {Request} from "../model/request";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {ProjectsService} from "./projects.service";

@Injectable()
export class RequestsService {
  selectedRequests: Set<string> = new Set();

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

  addRequest(project: Project, item: Item) {
    this.af.database.list('requests').push({
      item: item.$key,
      project: project.$key,
      quantity: 1,
      note: '',
      dropoff: project.lastUsedDropoff || '',
      date: project.lastUsedDate || ''
    });
  }

  update(id: string, update: any) {
    this.getRequest(id).update(update);
  }

  setSelected(id: string, value: boolean) {
    if (value) {
      this.selectedRequests.add(id);
    } else {
      this.selectedRequests.delete(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedRequests.has(id);
  }

  clearSelected() {
    this.selectedRequests = new Set();
  }

  getSelectedRequests(): Set<string> {
    return this.selectedRequests;
  }
}
