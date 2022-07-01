import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  ConfigDao,
  Group,
  GroupId,
  GroupsDao,
  Project,
  ProjectsDao,
} from 'app/season/dao';
import { containsEmail } from 'app/season/utility/contains-email';
import { GlobalConfigDao } from 'app/service/global-config-dao';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import firebase from 'firebase';

interface EditableRequestProperties {
  purchaser: Observable<boolean>;
  status: Observable<boolean>;
  allocation: Observable<boolean>;
  costAdjustment: Observable<boolean>;
  requester: Observable<boolean>;
}
@Injectable()
export class Permissions {
  permissions: Observable<Set<GroupId>>;

  isOwner: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isAcquisitions: Observable<boolean>;
  isApprover: Observable<boolean>;

  editableRequestProperties: EditableRequestProperties;

  private destroyed = new Subject();

  get editableProjects(): BehaviorSubject<Set<string> | null> {
    if (!this._editableProjects) {
      this._editableProjects = new BehaviorSubject(null);
      this.watchEditableProjects();
    }

    return this._editableProjects;
  }
  _editableProjects: BehaviorSubject<Set<string | null>>;

  constructor(
    private projectsDao: ProjectsDao,
    private groupsDao: GroupsDao,
    private configDao: ConfigDao,
    private globalConfigDao: GlobalConfigDao,
    private afAuth: AngularFireAuth,
  ) {
    const changes = [
      this.groupsDao.list,
      this.afAuth.authState,
      this.globalConfigDao.map.pipe(
        map((map) => (map ? map.get('owners').value : null)),
      ),
    ];
    this.permissions = combineLatest(changes).pipe(
      map((result) => {
        if (result[0] && result[1] && result[2]) {
          return this.getPermissions(result[0], result[1], result[2]);
        } else {
          return null;
        }
      }),
    );

    this.isOwner = this.permissions.pipe(
      map((p) => (p ? p.has('owners') : null)),
    );
    this.isAdmin = this.permissions.pipe(
      map((p) => (p ? p.has('admins') : null)),
    );
    this.isAcquisitions = this.permissions.pipe(
      map((p) => (p ? p.has('acquisitions') : null)),
    );
    this.isApprover = this.permissions.pipe(
      map((p) => (p ? p.has('approvers') : null)),
    );

    this.editableRequestProperties = {
      purchaser: this.isAcquisitions,
      status: this.isApprover,
      allocation: this.isAcquisitions,
      costAdjustment: this.isAcquisitions,
      requester: this.isAcquisitions,
    };
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  watchEditableProjects() {
    const changes = [
      this.permissions,
      this.projectsDao.list,
      this.afAuth.user.pipe(map((user) => (user ? user.email : ''))),
      this.configDao.map.pipe(
        map((values) => {
          return values && values.has('editsDisabled')
            ? values.get('editsDisabled').value
            : false;
        }),
      ),
      this.configDao.map.pipe(
        map((values) => {
          return values && values.has('allLeads')
            ? values.get('allLeads').value
            : false;
        }),
      ),
    ];

    combineLatest(changes)
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        const permissions: Set<GroupId> = result[0];
        const projects: Project[] = result[1];
        const email: string = result[2];
        const editsDisabled: boolean = result[3];
        const allLeads: boolean = result[4];

        // Cannot determine permissions if the user is not logged in
        if (!permissions || !email || !projects) {
          return;
        }

        const editableProjects = projects.filter((project) => {
          const isLead = containsEmail(project.leads, email) || allLeads;
          const isDirector = containsEmail(project.directors, email);
          const isAcquisitions = containsEmail(project.acquisitions, email);

          let canEditRequests = isDirector || isAcquisitions;
          if (editsDisabled && isLead) {
            canEditRequests = containsEmail(project.whitelist, email);
          }

          return canEditRequests || permissions.has('approvers');
        });

        this._editableProjects.next(new Set(editableProjects.map((p) => p.id)));
      });
  }

  getPermissions(
    groups: Group[],
    user: firebase.User,
    owners: string[],
  ): Set<GroupId> {
    const permissions = new Set<GroupId>();

    groups.forEach((group) => {
      const groupUsers = group.users.map((email) => email.toLowerCase().trim());
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
}
