import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {UsersService} from './users.service';
import {DaoService} from './dao-service';
import {User} from '../model/user';
import {Subject} from 'rxjs/Subject';

export type Group = 'admins' | 'acquisitions' | 'owners' | 'approvers';

export type Membership = {
  admins?: boolean;
  acquisitions?: boolean;
  owners?: boolean;
  approvers?: boolean;
};

@Injectable()
export class GroupsService extends DaoService<string> {
  membership$: Observable<Membership>;

  constructor(db: AngularFireDatabase,
              private usersService: UsersService) {
    super(db, 'groups');
    this.setupMembershipStream();
  }

  private setupMembershipStream() {
    const changes = [
      this.usersService.getCurrentUser(),
      this.getListDao().snapshotChanges()
    ];

    this.usersService.getCurrentUser().subscribe(console.log);
    this.getListDao().snapshotChanges().subscribe(console.log);

    this.membership$ = Observable.combineLatest(changes).map((result: any[]) => {
      return this.constructInitialMembership(result[0].email, result[1]);
    });
  }

  /** Constructs membership based on where the user fits into the database's groups. */
  private constructInitialMembership(userEmail: string, actions: SnapshotAction[]) {
    const membership: Membership = {};

    actions.forEach(action => {
      const memberList = action.payload.val();

      switch (action.key) {
        case 'admins':
          membership.admins = this.containsUser(memberList, userEmail); break;
        case 'acquisitions':
          membership.acquisitions = this.containsUser(memberList, userEmail); break;
        case 'owners':
          membership.owners = this.containsUser(memberList, userEmail); break;
        case 'approvers':
          membership.approvers = this.containsUser(memberList, userEmail); break;
      }
    });

    return membership;
  }

  getGroup(group: Group): Observable<string[]> {
    return this.getObjectDao(group).valueChanges().map((members: string) => {
      if (!members) { return []; }
      return members.split(',').map(this.normalizeEmail);
    });
  }

  setMembers(group: Group, members: string[]) {
    this.set(group, members.join(','));
  }

  isMember(...groups: Group[]): Observable<boolean> {
    // Always check if the member is an owner
    if (groups.indexOf('owners') === -1) { groups.push('owners'); }

    return this.usersService.getCurrentUser().flatMap(user => {
      const groupChecks: Observable<boolean>[] = [];
      for (let group of groups) {
        const groupCheck = this.getGroup(group)
            .map(members => members.indexOf(this.normalizeEmail(user.email)) !== -1);
        groupChecks.push(groupCheck);
      }

      return Observable.combineLatest.apply(this, groupChecks)
          .map((checks: boolean[]) => checks.some(check => check));
    });
  }

  containsUser(memberList = '', userEmail: string) {
    const members = memberList.split(',').map(this.normalizeEmail);
    return members.indexOf(userEmail) !== -1;
  }

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
