import {Injectable} from '@angular/core';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from '@angular/fire/database';
import {DaoService} from './dao-service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {map} from 'rxjs/operators';

@Injectable()
export class ProjectsService extends DaoService<Project> {
  projects: Observable<Project[]>;

  projectsMap = new BehaviorSubject<Map<string, Project>>(new Map());

  constructor(db: AngularFireDatabase) {
    super(db, 'projects');
    this.projects = this.getKeyedListDao();

    this.projects.subscribe(projects => {
      this.projectsMap.next(this.convertKeyedListToMap(projects));
    });
  }

  convertKeyedListToMap(list: any[]) {
    const map = new Map<string, any>();
    list.forEach(item => map.set(item.$key, item));
    return map;
  }

  getProjectsBySeason(season: string): Observable<Project[]> {
    const queryFn = ref => ref.orderByChild('season').equalTo(season);
    return this.queryList(queryFn);
  }

  getSortedProjects(season: string): Observable<Project[]> {
    return this.getProjectsBySeason(season).pipe(map(sortProjectsByName));
  }
}

export function sortProjectsByName(projects: Project[]) {
  const sortFn = (a: Project, b: Project) => ((a.name < b.name) ? -1 : 1);
  return projects.sort(sortFn);
}
