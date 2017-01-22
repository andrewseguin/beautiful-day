import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";

export type Group = 'admins' | 'acquisitions';

@Injectable()
export class GroupsService {

  constructor(private db: AngularFireDatabase) { }

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
}
