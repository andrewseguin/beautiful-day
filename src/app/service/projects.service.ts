import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

import {Project} from '../model/project';
import {RequestsService} from "./requests.service";

@Injectable()
export class ProjectsService {
  constructor(private af: AngularFire,
              private requestsService: RequestsService) {}

  getProjects(): FirebaseListObservable<Project[]> {
    return this.af.database.list('projects');
  }

  getProject(id: string): FirebaseObjectObservable<Project> {
    return this.af.database.object(`projects/${id}`);
  }

  setLastDropoff(id, dropoff, date): void {
    this.getProject(id).update({
      lastUsedDropoff: dropoff,
      lastUsedDate: date
    })
  }

  update(id, update: Project): void {
    this.getProject(id).update(update);
  }

  deleteProject(id: string) {
    this.requestsService.getProjectRequests(id).subscribe(requests => {
      requests.forEach(request => {
        this.requestsService.removeRequest(request.$key)
      });
    });
    this.getProject(id).remove();
  }
}
