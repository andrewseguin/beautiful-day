import {Injectable} from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import * as firebase from 'firebase';

import {Project} from '../model/project';
import {RequestsService} from "./requests.service";
import {Observable} from "rxjs";
import {Note} from "../model/note";

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

  getNote(id: string, noteId: string): FirebaseListObservable<any> {
    return this.af.database.list(`projects/${id}/notes/${noteId}`);
  }

  getNotes(id: string): FirebaseListObservable<any> {
    return this.af.database.list(`projects/${id}/notes`);
  }

  saveNote(id: string, note: Note) {
    this.af.database.object(`projects/${id}/notes/${note.$key}`).update({
      title: note.title,
      text: note.text
    });
  }

  createProject(): firebase.database.ThenableReference {
    return this.getProjects().push({
      name: 'New Project',
      description: '',
      location: '',
      notes: {
        'initial': 'test'
      }
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
