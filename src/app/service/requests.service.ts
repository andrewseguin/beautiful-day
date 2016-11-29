import { Injectable } from '@angular/core';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Item} from "../model/item";
import {Project} from "../model/project";
import {Request} from "../model/request";

@Injectable()
export class RequestsService {
  selectedRequests: Map<string, boolean> = new Map();

  constructor(private af: AngularFire) {}

  getAllRequests(): FirebaseListObservable<any[]> {
    return this.af.database.list('requests');
  }

  getProjectRequests(projectId: string): FirebaseListObservable<any[]> {
    return this.af.database.list('requests', {
      query: {
        orderByChild: 'project',
        equalTo: projectId
      }
    });
  }

  getRequest(id: string): FirebaseObjectObservable<any> {
    return this.af.database.object(`requests/${id}`);
  }

  removeRequest(id: string): void {
    this.getAllRequests().remove(id);
  }

  addRequest(project: Project, item: Item) {
    console.log(project);
    const newRequest: Request = {
      item: item.$key,
      project: project.$key,
      quantity: 1,
      notes: '',
      dropoff: project.dropoff ? Object.keys(project.dropoff)[0] : ''
    };
    this.af.database.list('requests').push(newRequest);
  }

  update(id: string, update: any) {
    this.getRequest(id).update(update);
  }

  setSelected(id: string, value: boolean) {
    this.selectedRequests.set(id, value);
  }

  isSelected(id: string): boolean {
    return this.selectedRequests.get(id);
  }

  clearSelected() {
    this.selectedRequests = new Map();
  }
}
