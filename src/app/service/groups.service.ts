import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, SnapshotAction} from 'angularfire2/database';
import {UsersService} from './users.service';
import {DaoService} from './dao-service';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map, mergeMap} from 'rxjs/operators';

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

    this.membership$ = combineLatest(changes).pipe(
        map((result: any[]) => constructInitialMembership(result[0].email, result[1])));
  }

  getGroup(group: Group): Observable<string[]> {
    return this.getObjectDao(group).valueChanges().map((members: string) => {
      if (!members) { return []; }
      return members.split(',').map(normalizeEmail);
    });
  }

  setMembers(group: Group, members: string[]) {
    this.set(group, members.join(','));
  }

  isMember(...groups: Group[]): Observable<boolean> {
    // Always check if the member is an owner
    if (groups.indexOf('owners') === -1) { groups.push('owners'); }

    return this.usersService.getCurrentUser().pipe(mergeMap(user => {
      const groupChecks: Observable<boolean>[] = [];
      for (let group of groups) {
        const groupCheck = this.getGroup(group)
            .map(members => members.indexOf(normalizeEmail(user.email)) !== -1);
        groupChecks.push(groupCheck);
      }

      return combineLatest.apply(this, groupChecks).pipe(
          map((checks: boolean[]) => checks.some(check => check)));
    }));
  }
}

/** Constructs membership based on where the user fits into the database's groups. */
function constructInitialMembership(userEmail: string, actions: SnapshotAction[]) {
  const membership: Membership = {};

  actions.forEach(action => {
    const memberList = action.payload.val();

    switch (action.key) {
      case 'admins':
        membership.admins = containsUser(memberList, userEmail); break;
      case 'acquisitions':
        membership.acquisitions = containsUser(memberList, userEmail); break;
      case 'owners':
        membership.owners = containsUser(memberList, userEmail); break;
      case 'approvers':
        membership.approvers = containsUser(memberList, userEmail); break;
    }
  });

  return membership;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function containsUser(memberList = '', userEmail: string) {
  const members = memberList.split(',').map(normalizeEmail);
  return members.indexOf(userEmail) !== -1;
}
