import { Injectable } from '@angular/core';
import {FirebaseListObservable, AngularFire, FirebaseObjectObservable} from "angularfire2";
import {Item} from "../model/item";
import {Project} from "../model/project";
import {Request} from "../model/request";

@Injectable()
export class RequestsService {
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
      dropoff: project.dropoff ? Object.keys(project.dropoff)[0] : ''
    };
    this.af.database.list('requests').push(newRequest);
  }
}
