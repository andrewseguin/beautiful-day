import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AngularFireDatabase} from "angularfire2";

@Injectable()
export class AdminsService {

  constructor(private db: AngularFireDatabase) { }

  getAdmins(): Observable<string[]> {
    return this.db.object('admins').map(admins => {
      return admins.$value ? admins.$value.split(',') : [];
    });
  }

  setAdmins(admins: string[]) {
    this.db.object('admins').set(admins.join(','));
  }
}
