import {Injectable} from '@angular/core';
import {Project} from '../model/project';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from 'angularfire2/database';
import {DaoService} from './dao-service';

@Injectable()
export class ProjectsService extends DaoService<Project> {
  projects: Observable<Project[]>;

  constructor(db: AngularFireDatabase) {
    super(db, 'projects');
    this.projects = this.getKeyedListDao();
  }

  getSortedProjects(): Observable<Project[]> {
    const sortFn = (a: Project, b: Project) => ((a.name < b.name) ? -1 : 1);
    return this.projects.map(projects => projects.sort(sortFn));
  }
}
