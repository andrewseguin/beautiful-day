import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

import {Project} from '../model/project';
import {RequestsService} from "./requests.service";
import {Observable} from "rxjs";

@Injectable()
export class ProjectsService {
  constructor(private af: AngularFire,
              private requestsService: RequestsService) {}

  getProjects(): FirebaseListObservable<Project[]> {
    return this.af.database.list('projects');
  }

  getUsersProjects(email: string): Observable<Project[]> {
    return this.getProjects().flatMap(projects => {

      let usersProjects = [];
      projects.forEach(project => {
        let managers = project.managers ? project.managers.split(',') : [];
        let isManager = managers.some(manager => manager == email);

        if (isManager || project.director == email) {
          usersProjects.push(project);
        }
      });
      return [usersProjects];
    });
  }

  getProject(id: string): FirebaseObjectObservable<Project> {
    return this.af.database.object(`projects/${id}`);
  }

  createProject() {
    this.getProjects().push({
      name: 'New Project',
      description: '',
      location: ''
    });
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
