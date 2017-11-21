import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {ProjectsService} from "./projects.service";
import {Observable} from "rxjs";
import {UsersService} from "./users.service";
import {GroupsService} from "./groups.service";
import {Project} from '../model/project';
import {transformSnapshotAction} from '../utility/snapshot-tranform';

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
    let isAdminOrOwner: boolean;
    let isRequestEditor: boolean;

    return this.usersService.getCurrentUser().flatMap(u => {
      user = u;
      return this.groupsService.isMember('admins', 'owners');
    }).flatMap(result => {
      isAdminOrOwner = result;
      return this.groupsService.isMember('acquisitions', 'approvers');
    }).flatMap(result => {
      isRequestEditor = result;
      return this.projectsService.getProject(projectId);
    }).flatMap((project: Project) => {
      const leads = project.leads || '';
      const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());
      const isLead = lowercaseLeads.indexOf(user.email.toLowerCase()) !== -1;

      const directors = project.directors || '';
      const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
      const isDirector = lowercaseDirectors.indexOf(user.email.toLowerCase()) !== -1;

      return Observable.of({
        details: isDirector || isAdminOrOwner,
        notes: isLead || isDirector || isAdminOrOwner,
        requests: isLead || isDirector || isAdminOrOwner || isRequestEditor
      });
    });
  }

  canCreateProjects(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canEditEvents(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canManageAcqusitions(): Observable<boolean> {
    return this.groupsService.isMember('admins', 'owners', 'acquisitions');
  }

  canManageAcqusitionsTeam(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  canManageAdmins(): Observable<boolean> {
    return this.isOwner();
  }

  canViewFeedback(): Observable<boolean> {
    return this.isOwner();
  }

  canImportItems(): Observable<boolean> {
    return this.isCurrentUserOwnerOrAdmin();
  }

  private isOwner(): Observable<boolean> {
    return this.groupsService.isMember('owners')
  }

  private isCurrentUserOwnerOrAdmin(): Observable<boolean> {
    return this.groupsService.isMember('admins', 'owners')
  }
}
