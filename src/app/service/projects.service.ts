import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Project} from '../model/project';
import {Observable} from 'rxjs';
import {
  AngularFireDatabase, AngularFireList, AngularFireObject,
} from 'angularfire2/database';
import {transformSnapshotAction} from '../utility/snapshot-tranform';

@Injectable()
export class ProjectsService {
  constructor(private db: AngularFireDatabase) {}

  getProjects(): AngularFireList<Project> {
    return this.db.list('projects');
  }

  getProject(id: string): AngularFireObject<Project> {
    return this.db.object(`projects/${id}`);
  }

  getSortedProjects(): Observable<Project[]> {
    return this.getProjects().snapshotChanges().map(projects => {
      let projectsWithKeys = projects.map(project => {
        let val: Project = project.payload.val();
        val.$key = project.key;
        return val;
      })
      return projectsWithKeys.sort((a: Project, b: Project) => {
        return (a.name < b.name) ? -1 : 1;
      });
    });
  }

  getBudget(id: string): Observable<number> {
    return this.db.object(`projects/${id}/budget`).valueChanges();
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
