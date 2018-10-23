import {Injectable} from '@angular/core';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import {Project} from 'app/model';
import {map, take, takeUntil} from 'rxjs/operators';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {BehaviorSubject, Subject} from 'rxjs';
import {ConfigDao, Group, GroupId, GroupsDao, ProjectsDao} from 'app/service/dao';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class PermissionsService {
  permissions = combineLatest([this.groupsDao.list, this.afAuth.authState]).pipe(
      map(result => this.getPermissions(result[0], result[1])));

  isOwner = this.permissions.pipe(map(p => p.has('owners')));
  isAdmin = this.permissions.pipe(map(p => p.has('admins')));
  isAcquisitions = this.permissions.pipe(map(p => p.has('acquisitions')));

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
              private afAuth: AngularFireAuth) {}

  watchEditableProjects() {
    const changes = [
      this.permissions,
      this.projectsDao.list,
      this.afAuth.user.pipe(map(user => user ? user.email : '')),
      this.configDao.values.pipe(map(values => values ? values.get('editsDisabled') : false)),
      this.configDao.values.pipe(map(values => values ? values.get('allLeads') : false)),
    ];

    combineLatest(changes).subscribe(result => {
      const permissions: Set<GroupId> = result[0];
      const projects: Project[] = result[1];
      const email: string = result[2];
      const editsDisabled: boolean = result[3];
      const allLeads: boolean = result[4];

      // Cannot determine permissions if the user is not logged in
      if (!email || !projects) {
        return;
      }

      const editableProjects = projects.filter(project => {
        const leads = project.leads || '';
        const lowercaseLeads = leads.split(',').map(m => m.toLowerCase());

        const isLead = lowercaseLeads.indexOf(email.toLowerCase()) !== -1 || allLeads;

        const directors = project.directors || '';
        const lowercaseDirectors = directors.split(',').map(m => m.toLowerCase());
        const isDirector = lowercaseDirectors.indexOf(email.toLowerCase()) !== -1;

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

  getPermissions(groups: Group[], user: any) {
    if (!groups || !user) {
      return new Set();
    }

    const permissions = new Set<GroupId>();

    groups.forEach(group => {
      const groupUsers = group.users.map(email => email.toLowerCase().trim());
      const userEmail = user.email.toLowerCase().trim();
      if (groupUsers.indexOf(userEmail) != -1) {
        permissions.add(group.id);
      }
    });

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
    const whitelist = project.whitelist || '';
    const lowercaseWhitelist = whitelist.split(',').map(m => m.toLowerCase());
    return lowercaseWhitelist.indexOf(email.toLowerCase()) !== -1;
  }

  toggleWhitelisted(user: User, project: Project) {
    const whitelist = project.whitelist || '';
    const whitelistSet = new Set(whitelist.split(','));

    if (whitelistSet.has(user.email)) {
      whitelistSet.delete(user.email);
    } else {
      whitelistSet.add(user.email);
    }

    this.projectsDao.update(project.id, {
      whitelist: Array.from(whitelistSet).join(',')
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
