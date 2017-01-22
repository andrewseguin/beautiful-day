import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {ProjectsService} from "./projects.service";
import {Observable} from "rxjs";
import {UsersService} from "./users.service";
import {GroupsService} from "./groups.service";

export interface EditPermissions {
  details?: boolean;
  notes?: boolean;
  requests?: boolean;
}

@Injectable()
export class PermissionsService {
  constructor(private projectsService: ProjectsService,
              private groupsService: GroupsService,
              private usersService: UsersService) { }

  getEditPermissions(projectId: string): Observable<EditPermissions> {
    let user: User;
    let admins: string[];

    return this.usersService.getCurrentUser().flatMap(u => {
      user = u;
      return this.groupsService.get('admins');
    }).flatMap(members => {
      admins = members;
      return this.projectsService.getProject(projectId);
    }).flatMap(project => {
      const isAdmin = admins.indexOf(user.email) != -1;

      const leads = project.leads || '';
      const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());
      const isLead = lowercaseLeads.indexOf(user.email.toLowerCase()) != -1;

      const directors = project.directors || '';
      const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
      const isDirector = lowercaseDirectors.indexOf(user.email.toLowerCase()) != -1;

      return Observable.from([{
        details: isDirector || isAdmin || user.isOwner,
        notes: isLead || isDirector || isAdmin || user.isOwner,
        requests: isLead || isDirector || isAdmin || user.isOwner
      }]);
    });
  }

  canCreateProjects(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canEditEvents(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canManageAcqusitions(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canManageAdmins(): Observable<boolean> {
    return this.isOwner();
  }

  canViewFeedback(): Observable<boolean> {
    return this.isOwner();
  }

  private isOwner(): Observable<boolean> {
    return this.usersService.getCurrentUser()
        .map(user => user ? user.isOwner : false);
  }

  private isCurrentUserOwnerOrAdmin(): Observable<boolean> {
    let isOwner = false;
    return this.usersService.getCurrentUser()
      .flatMap(user => {
        isOwner = user.isOwner;
        return this.groupsService.isMember('admins', user.email);
      }).map(isAdmin => isOwner || isAdmin);
  }
}
