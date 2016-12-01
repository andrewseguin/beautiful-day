import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

import {Project} from '../model/project';

@Injectable()
export class ProjectsService {
  constructor(private af: AngularFire) {}

  getProjects(): FirebaseListObservable<Project[]> {
    return this.af.database.list('projects');
  }

  getProject(id: string): FirebaseObjectObservable<Project> {
    return this.af.database.object(`projects/${id}`);
  }

  setLastDropoff(id, dropoff, date) {
    this.getProject(id).update({
      lastUsedDropoff: dropoff,
      lastUsedDate: date
    })
  }
}
