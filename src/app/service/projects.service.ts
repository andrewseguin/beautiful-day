import {Injectable, OnDestroy} from '@angular/core';
import {Project} from 'app/model/project';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase} from '@angular/fire/database';
import {DaoService} from './dao-service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class ProjectsService extends DaoService<Project> implements OnDestroy {
  projects = new BehaviorSubject<Project[]>([]);
  projectsMap = new BehaviorSubject<Map<string, Project>>(new Map());

  private destroyed = new Subject();


  constructor(db: AngularFireDatabase) {
    super(db, 'projects');
    this.getKeyedListDao().pipe(takeUntil(this.destroyed)).subscribe(projects => {
      this.projects.next(projects);
      this.projectsMap.next(this.convertKeyedListToMap(projects));
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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
