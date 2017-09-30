import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Project} from '../model/project';
import {Observable} from 'rxjs';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database';

@Injectable()
export class ProjectsService {
  constructor(private db: AngularFireDatabase) {}

  getProjects(): FirebaseListObservable<Project[]> {
    return this.db.list('projects');
  }

  getSortedProjects(): Observable<Project[]> {
    return this.db.list('projects').map(projects => {
      return projects.sort((a: Project, b: Project) => {
        return (a.name < b.name) ? -1 : 1;
      });
    });
  }

  getProject(id: string): FirebaseObjectObservable<Project> {
    return this.db.object(`projects/${id}`);
  }

  getBudget(id: string): Observable<number> {
    return this.db.object(`projects/${id}/budget`).map(budget => budget['$value']);
  }

  createProject(): firebase.database.ThenableReference {
    return this.getProjects().push({
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
    this.getProject(id).remove();
  }
}
