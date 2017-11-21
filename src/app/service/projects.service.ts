import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Project} from '../model/project';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import {transformSnapshotAction, transformSnapshotActionList} from '../utility/snapshot-tranform';

@Injectable()
export class ProjectsService {
  projects: Observable<Project[]>;

  constructor(private db: AngularFireDatabase) {
    this.projects = this._getListDao().snapshotChanges().map(transformSnapshotActionList);
  }

  getProject(id: string): Observable<Project> {
    return this._getObjectDao(id).snapshotChanges().map(transformSnapshotAction);
  }

  _getObjectDao(id: string): AngularFireObject<Project> {
    return this.db.object(`projects/${id}`);
  }

  _getListDao(): AngularFireList<Project> {
    return this.db.list(`projects`);
  }

  getSortedProjects(): Observable<Project[]> {
    const sortFn = (a, b) => ((a.name < b.name) ? -1 : 1);
    return this.projects.map(projects => projects.sort(sortFn));
  }

  createProject(): firebase.database.ThenableReference {
    const newProject = {
      name: 'New Project',
      description: '',
      location: ''
    };

    return this._getListDao().push(newProject);
  }

  updateProject(id, update: Project): void {
    this._getObjectDao(id).update(update);
  }

  deleteProject(id: string) {
    this._getObjectDao(id).remove();
  }
}
