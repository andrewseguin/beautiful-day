import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";
import {UsersService} from "./users.service";

export type Group = 'admins' | 'acquisitions' | 'owners' | 'approvers';

@Injectable()
export class GroupsService {

  constructor(private db: AngularFireDatabase,
              private usersService: UsersService) { }

  get(group: Group): Observable<string[]> {
    return this.db.object(`groups/${group}`).map(members => {
      if (!members.$value) { return []; }

      return members.$value.split(',').map(member => this.normalizeEmail(member));
    });
  }

  setMembers(group: Group, members: string[]) {
    this.db.object(`groups/${group}`).set(members.join(','));
  }

  isMember(...groups: Group[]): Observable<boolean> {
    if (groups.indexOf('owners') == -1) groups.push('owners');

    return this.usersService.getCurrentUser().flatMap(user => {
      const groupChecks: Observable<boolean>[] = [];
      for (let group of groups) {
        const groupCheck = this.get(group)
            .map(members => members.indexOf(this.normalizeEmail(user.email)) != -1);
        groupChecks.push(groupCheck)
      }

      return Observable.combineLatest.apply(this, groupChecks)
          .map((checks: boolean[]) => checks.some(check => check));
    })
  }

  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
