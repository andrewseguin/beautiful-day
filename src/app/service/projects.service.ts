import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

import {Project} from '../model/project';

@Injectable()
export class ProjectsService {
  constructor(private af: AngularFire) {}

  getProjects(): FirebaseListObservable<any[]> {
    return this.af.database.list('projects');
  }

  getProject(id: string): FirebaseObjectObservable<any> {
    return this.af.database.object(`projects/${id}`);
  }

  getDropoffLocations(id: string) {
    return this.af.database.list(`projects/${id}/dropoff`);
  }

  getDropoffLocation(id: string, dropoff: string) {
    return this.af.database.object(`projects/${id}/dropoff/${dropoff}`);
  }
}
