import {Injectable} from '@angular/core';
import {User} from '../model/user';
import {ProjectsService} from './projects.service';
import {Observable} from 'rxjs/Observable';
import {UsersService} from './users.service';
import {GroupsService, Membership} from './groups.service';
import {Project} from '../model/project';
import {map} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';

export interface EditProjectPermissions {
  details?: boolean;
  notes?: boolean;
  requests?: boolean;
}

export interface Permissions {
  owner?: boolean;
  admin?: boolean;
  acquisition?: boolean;
  approver?: boolean;
}


@Injectable()
export class PermissionsService {
  permissions: Observable<Permissions>;

  constructor(private projectsService: ProjectsService,
              private groupsService: GroupsService,
              private usersService: UsersService) {
    this.permissions = this.groupsService.membership$.map(m => this.getPermissions(m));
  }

  getPermissions(membership: Membership) {
    const permissions: Permissions = {
      owner: membership.owners,
      admin: membership.admins,
      acquisition: membership.acquisitions,
      approver: membership.approvers
    };

    // Owners are higher level admins
    if (permissions.owner) {
      permissions.admin = true;
    }

    // Admins automatically have permission as other groups
    if (permissions.admin) {
      permissions.acquisition = true;
      permissions.approver = true;
    }

    // All of the acquisitions team can be approvers
    if (permissions.acquisition) {
      permissions.approver = true;
    }

    return permissions;
  }

  getEditPermissions(projectId: string): Observable<EditProjectPermissions> {
    const changes = [
      this.permissions,
      this.projectsService.get(projectId),
      this.usersService.getCurrentUser(),
    ];

    return combineLatest(changes).pipe(map((result: any[]) => {
      const permissions: Permissions = result[0];
      const project: Project = result[1];
      const user: User = result[2];

      const leads = project.leads || '';
      const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());
      const isLead = lowercaseLeads.indexOf(user.email.toLowerCase()) !== -1;

      const directors = project.directors || '';
      const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
      const isDirector = lowercaseDirectors.indexOf(user.email.toLowerCase()) !== -1;

      return {
        details: isDirector || permissions.admin,
        notes: isLead || isDirector || permissions.admin,
        requests: isLead || isDirector || permissions.approver
      };
    }));
  }

  canManageAdmins(): Observable<boolean> {
    return this.isOwner();
  }

  canViewFeedback(): Observable<boolean> {
    return this.isOwner();
  }

  canCreateProjects(): Observable<boolean> {
    return this.isAdmin();
  }

  canImportItems(): Observable<boolean> {
    return this.isAdmin();
  }

  canEditEvents(): Observable<boolean> {
    return this.isAdmin();
  }

  canManageAcquisitionsTeam(): Observable<boolean> {
    return this.isAdmin();
  }

  canManageAcquisitions(): Observable<boolean> {
    return this.isAcquisitions();
  }

  private isOwner(): Observable<boolean> {
    return this.permissions.map(permissions => permissions.owner);
  }

  private isAdmin(): Observable<boolean> {
    return this.permissions.map(permissions => permissions.admin);
  }

  private isAcquisitions(): Observable<boolean> {
    return this.permissions.map(permissions => permissions.acquisition);
  }
}
