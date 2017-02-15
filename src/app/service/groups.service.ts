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

  isMember(group: Group, email: string): Observable<boolean> {
    return this.get(group).map(members => members.indexOf(email) != -1);
  }

  isAcquistionsUser(): Observable<boolean> {
    return this.usersService.getCurrentUser().flatMap(user => {
      if (user.isOwner) return Observable.of(true);
      return this.isMember('acquisitions', user.email);
    });
  }
}
