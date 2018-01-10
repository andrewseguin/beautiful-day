import {Injectable} from '@angular/core';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from 'angularfire2/database';
import {DaoService} from './dao-service';

@Injectable()
export class ProjectsService extends DaoService<Project> {
  projects: Observable<Project[]>;

  constructor(db: AngularFireDatabase) {
    super(db, 'projects');
    this.projects = this.getKeyedListDao();
  }

  getProjectsBySeason(season: string): Observable<Project[]> {
    const queryFn = ref => ref.orderByChild('season').equalTo(season);
    return this.queryList(queryFn);
  }

  getSortedProjects(season: string): Observable<Project[]> {
    return this.getProjectsBySeason(season).map(sortProjectsByName);
  }
}

export function sortProjectsByName(projects: Project[]) {
  const sortFn = (a: Project, b: Project) => ((a.name < b.name) ? -1 : 1);
  return projects.sort(sortFn);
}
