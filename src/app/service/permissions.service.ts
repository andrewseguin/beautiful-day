import {Injectable} from '@angular/core';
import {User} from 'app/model/user';
import {ProjectsService} from './projects.service';
import {Observable} from 'rxjs/Observable';
import {GroupsService, Membership} from './groups.service';
import {Project} from '../model/project';
import {map} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from 'app/service/auth-service';
import {BehaviorSubject} from 'rxjs';

export interface EditProjectPermissions {
  details?: boolean;
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
  /** Flag that allows all visitors the ability to access/change data as leads. For demo. */
  allLeads = false;

  /** Flag that disables leads/directors from making request changes. */
  editsDisabled: boolean;

  permissions = this.groupsService.memberships.pipe(map(m => this.getPermissions(m)));
  isOwner = this.permissions.pipe(map(p => p.owner));
  isAdmin = this.permissions.pipe(map(p => p.admin));
  isAcquisitions = this.permissions.pipe(map(p => p.acquisition));

  editableProjects = new BehaviorSubject(new Set<string>());

  constructor(private projectsService: ProjectsService,
              private groupsService: GroupsService,
              private authService: AuthService,
              protected db: AngularFireDatabase) {
    db.object<boolean>('allLeads').valueChanges().subscribe((val: boolean) => {
      this.allLeads = val;
    });

    // Disables changes from leads and directors
    db.object<boolean>('editsDisabled').valueChanges().subscribe((val: boolean) => {
      this.editsDisabled = val;
    });

    const changes = [
      this.permissions,
      this.projectsService.projects,
      this.authService.user,
      this.db.object<boolean>('editsDisabled').valueChanges(),
    ];

    combineLatest(changes).subscribe(result => {
      const permissions: Permissions = result[0];
      const projects: Project[] = result[1];
      const user: User = result[2];
      const editsDisabled: boolean = result[3];

      // Cannot determine permissions if the user is not logged in
      if (!user) {
        return;
      }

      const editableProjects = projects.filter(project => {
        if (!user) { return false; }

        const leads = project.leads || '';
        const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());

        const isLead = lowercaseLeads.indexOf(user.email.toLowerCase()) !== -1 || this.allLeads;

        const directors = project.directors || '';
        const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
        const isDirector = lowercaseDirectors.indexOf(user.email.toLowerCase()) !== -1;

        let canEditRequests = isLead || isDirector;
        if (editsDisabled) {
          canEditRequests = this.isUserWhitelisted(user, project);
        }

        return canEditRequests || permissions.approver;
      });

      this.editableProjects.next(new Set(editableProjects.map(p => p.$key)));
    });
  }

  toggleEditsDisabled() {
    this.db.object('editsDisabled').set(!this.editsDisabled);
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
      this.authService.user,
      this.db.object<boolean>('editsDisabled').valueChanges(),
    ];

    return combineLatest(changes).pipe(map((result: any[]) => {
      const permissions: Permissions = result[0];
      const project: Project = result[1];
      const user: User = result[2] || {};

      const leads = project.leads || '';
      const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());

      const isLead = lowercaseLeads.indexOf(user.email.toLowerCase()) !== -1 || this.allLeads;

      const directors = project.directors || '';
      const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
      const isDirector = lowercaseDirectors.indexOf(user.email.toLowerCase()) !== -1;

      let canEditRequests = isLead || isDirector;
      if (this.editsDisabled) {
        canEditRequests = this.isUserWhitelisted(user, project);
      }
      canEditRequests = canEditRequests || permissions.approver;

      return {
        requests: canEditRequests
      };
    }));
  }

  isUserWhitelisted(user: User, project: Project): boolean {
    const whitelist = project.whitelist || '';
    const lowercaseWhitelist = whitelist.split(',').map(m => m.toLowerCase());
    return lowercaseWhitelist.indexOf(user.email.toLowerCase()) !== -1;
  }

  toggleWhitelisted(user: User, project: Project) {
    const whitelist = project.whitelist || '';
    const whitelistSet = new Set(whitelist.split(','));

    if (whitelistSet.has(user.email)) {
      whitelistSet.delete(user.email);
    } else {
      whitelistSet.add(user.email);
    }

    this.projectsService.update(project.$key, {whitelist: Array.from(whitelistSet).join(',')});
  }

  canManageAdmins(): Observable<boolean> {
    return this.isOwner;
  }

  canViewFeedback(): Observable<boolean> {
    return this.isOwner;
  }

  canCreateProjects(): Observable<boolean> {
    return this.isAdmin;
  }

  canViewPastProjects(): Observable<boolean> {
    return this.isAdmin;
  }

  canImportItems(): Observable<boolean> {
    return this.isAdmin;
  }

  canEditEvents(): Observable<boolean> {
    return this.isAdmin;
  }

  canManageAcquisitionsTeam(): Observable<boolean> {
    return this.isAdmin;
  }

  canManageAcquisitions(): Observable<boolean> {
    return this.isAcquisitions;
  }
}
