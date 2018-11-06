import {Injectable} from '@angular/core';
import {User} from 'app/service/users-dao';
import {Observable} from 'rxjs/Observable';
import {ConfigDao, Group, GroupId, GroupsDao, Project, ProjectsDao} from 'app/season/dao';
import {map, takeUntil} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {BehaviorSubject, Subject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {GlobalConfigDao} from 'app/service/global-config-dao';

@Injectable()
export class Permissions {
  permissions: Observable<Set<GroupId>>;

  isOwner: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isAcquisitions: Observable<boolean>;
  isApprover: Observable<boolean>;

  private destroyed = new Subject();

  get editableProjects(): BehaviorSubject<Set<string|null>> {
    if (!this._editableProjects) {
      this._editableProjects = new BehaviorSubject(null);
      this.watchEditableProjects();
    }

    return this._editableProjects;
  }
  _editableProjects: BehaviorSubject<Set<string|null>>;

  constructor(private projectsDao: ProjectsDao,
              private groupsDao: GroupsDao,
              private configDao: ConfigDao,
              private globalConfigDao: GlobalConfigDao,
              private afAuth: AngularFireAuth) {
    const changes = [
      this.groupsDao.list,
      this.afAuth.authState,
      this.globalConfigDao.map.pipe(map(map => map ? map.get('owners').value : null)),
    ];
    this.permissions = combineLatest(changes).pipe(
      map(result => {
        if (result[0] && result[1] && result[2]) {
          return this.getPermissions(result[0], result[1], result[2]);
        } else {
          return null;
        }
      }));

    this.isOwner = this.permissions.pipe(map(p => p ? p.has('owners') : null));
    this.isAdmin = this.permissions.pipe(map(p => p ? p.has('admins') : null));
    this.isAcquisitions = this.permissions.pipe(map(p => p ? p.has('acquisitions') : null));
    this.isApprover = this.permissions.pipe(map(p => p ? p.has('approvers') : null));
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  watchEditableProjects() {
    const changes = [
      this.permissions,
      this.projectsDao.list,
      this.afAuth.user.pipe(map(user => user ? user.email : '')),
      this.configDao.values.pipe(map(values => values ? values.get('editsDisabled') : false)),
      this.configDao.values.pipe(map(values => values ? values.get('allLeads') : false)),
    ];

    combineLatest(changes).pipe(takeUntil(this.destroyed)).subscribe(result => {
      const permissions: Set<GroupId> = result[0];
      const projects: Project[] = result[1];
      const email: string = result[2];
      const editsDisabled: boolean = result[3];
      const allLeads: boolean = result[4];

      // Cannot determine permissions if the user is not logged in
      if (!permissions || !email || !projects) {
        return;
      }

      const editableProjects = projects.filter(project => {
        const isLead = containsEmail(project.leads, email) || allLeads;
        const isDirector = containsEmail(project.directors, email);

        let canEditRequests = isLead || isDirector;
        if (editsDisabled) {
          canEditRequests = this.isUserWhitelisted(email, project);
        }

        return canEditRequests || permissions.has('approvers');
      });

      this._editableProjects.next(new Set(editableProjects.map(p => p.id)));
    });
  }

  toggleEditsDisabled() {
    const done = new Subject();
    this.configDao.values.pipe(takeUntil(done)).subscribe(values => {
      if (values) {
        this.configDao.update('editsDisabled', !values.get('editsDisabled'));
        done.next();
        done.complete();
      }
    });
  }

  getPermissions(groups: Group[], user: firebase.User, owners: string[]): Set<GroupId> {
    const permissions = new Set<GroupId>();

    groups.forEach(group => {
      const groupUsers = group.users.map(email => email.toLowerCase().trim());
      if (containsEmail(groupUsers, user.email)) {
        permissions.add(group.id);
      }
    });

    if (owners.indexOf(user.email) != -1) {
      permissions.add('owners');
    }

    if (permissions.has('owners')) {
      permissions.add('admins');
    }

    if (permissions.has('admins')) {
      permissions.add('acquisitions');
    }

    if (permissions.has('acquisitions')) {
      permissions.add('approvers');
    }

    return permissions;
  }

  isUserWhitelisted(email: string, project: Project): boolean {
    return containsEmail(project.whitelist, email);
  }

  toggleWhitelisted(user: User, project: Project) {
    const whitelistSet = new Set(project.whitelist || []);

    if (whitelistSet.has(user.email)) {
      whitelistSet.delete(user.email);
    } else {
      whitelistSet.add(user.email);
    }

    this.projectsDao.update(project.id, {
      whitelist: Array.from(whitelistSet)
    });
  }

  canManageAdmins(): Observable<boolean> {
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

function containsEmail(list: string[] = [], email: string) {
  list = list.map(value => value.toLowerCase().trim());
  email = email.toLowerCase().trim();
  return list.indexOf(email) != -1;
}
