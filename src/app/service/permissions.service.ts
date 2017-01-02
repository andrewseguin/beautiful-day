import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {ProjectsService} from "./projects.service";
import {Observable} from "rxjs";
import {FirebaseAuth} from "angularfire2";
import {UsersService} from "./users.service";

export interface EditPermissions {
  details?: boolean;
  notes?: boolean;
  requests?: boolean;
}

@Injectable()
export class PermissionsService {
  constructor(private projectsService: ProjectsService,
              private usersService: UsersService,
              private auth: FirebaseAuth) { }

  getEditPermissions(projectId: string): Observable<EditPermissions> {
    let user: User;

    return this.auth.flatMap(authState => {
      return this.usersService.get(authState.auth.email);
    }).flatMap(u => {
      console.log(u);
      user = u;
      return this.projectsService.getProject(projectId);
    }).flatMap(project => {
      const isAdmin = user.isAdmin && false;
      const isDirector = user.email == project.director;

      const managers = project.managers || '';
      const lowercaseManagers = managers.split(',').map(m => m.toLowerCase());
      const isManager = lowercaseManagers.indexOf(user.email.toLowerCase()) != -1;

      return Observable.from([{
        details: isDirector || isAdmin,
        notes: isManager || isDirector || isAdmin,
        requests: isManager || isDirector || isAdmin
      }]);
    });
  }

  canCreateProjects(): Observable<boolean> {
    return this.auth.flatMap(authState => {
      return this.usersService.get(authState.auth.email);
    }).flatMap(user => Observable.from([user.isAdmin]));
  }
}
