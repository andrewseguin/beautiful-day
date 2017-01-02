import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {ProjectsService} from "./projects.service";
import {Observable} from "rxjs";
import {UsersService} from "./users.service";
import {AdminsService} from "./admins.service";

export interface EditPermissions {
  details?: boolean;
  notes?: boolean;
  requests?: boolean;
}

@Injectable()
export class PermissionsService {
  constructor(private projectsService: ProjectsService,
              private adminsService: AdminsService,
              private usersService: UsersService) { }

  getEditPermissions(projectId: string): Observable<EditPermissions> {
    let user: User;
    let admins: string[];

    return this.usersService.getCurrentUser().flatMap(u => {
      user = u;
      return this.adminsService.getAdmins();
    }).flatMap(a => {
      admins = a;
      return this.projectsService.getProject(projectId);
    }).flatMap(project => {
      const isAdmin = admins.indexOf(user.email) != -1;
      const isDirector = user.email == project.director;

      const managers = project.managers || '';
      const lowercaseManagers = managers.split(',').map(m => m.toLowerCase());
      const isManager = lowercaseManagers.indexOf(user.email.toLowerCase()) != -1;

      return Observable.from([{
        details: isDirector || isAdmin || user.isOwner,
        notes: isManager || isDirector || isAdmin || user.isOwner,
        requests: isManager || isDirector || isAdmin || user.isOwner
      }]);
    });
  }

  canCreateProjects(): Observable<boolean> {
    return this.usersService.getCurrentUser().map(user => user ? user.isAdmin : false);
  }

  isOwner(): Observable<boolean> {
    return this.usersService.getCurrentUser().map(user => user ? user.isOwner : false);
  }
}
