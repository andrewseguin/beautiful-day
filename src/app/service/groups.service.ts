import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";
import {UsersService} from "./users.service";

export type Group = 'admins' | 'acquisitions';

@Injectable()
export class GroupsService {

  constructor(private db: AngularFireDatabase,
              private usersService: UsersService) { }

  get(group: Group): Observable<string[]> {
    return this.db.object(`groups/${group}`).map(members => {
      return members.$value ? members.$value.split(',') : [];
    });
  }

  setMembers(group: Group, members: string[]) {
    this.db.object(`groups/${group}`).set(members.join(','));
  }

  isMember(email: string, ...groups: Group[]): Observable<boolean> {
    const groupChecks: Observable<boolean>[] = [];
    for (let group of groups) {
      const groupCheck = this.get(group).map(members => members.indexOf(email) != -1);
      groupChecks.push(groupCheck)
    }

    // TODO: Add all group checks in here
    return Observable.combineLatest(
      groupChecks[0]
    ).map((checks: boolean[]) => checks.every(check => check));
  }

  isAcquistionsUser(): Observable<boolean> {
    return this.usersService.getCurrentUser().flatMap(user => {
      if (user.isOwner) return Observable.of(true);
      return this.isMember(user.email, 'acquisitions');
    });
  }
}
