import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {DaoService} from './dao-service';
import {take} from 'rxjs/operators';
import {transformSnapshotActionList} from 'app/utility/snapshot-tranform';

@Injectable()
export class UsersService extends DaoService<User> {
  users = this.getListDao().snapshotChanges().map(transformSnapshotActionList);
  usersMap = this.users.map(users => {
    const usersMap = new Map<string, User>();
    users.forEach(user => usersMap.set(user.$key, user));
    return usersMap;
  });

  constructor(protected db: AngularFireDatabase) {
    super(db, 'users');
  }

  private create(authState: firebase.User) {
    this.getObjectDao(authState.uid).set({
      uid: authState.uid,
      email: authState.email,
      name: authState.displayName,
      pic: authState.photoURL
    });
  }

  /** Checks if the user is in the DB and if not, add their info. */
  addUserData(authState: firebase.User) {
    this.getObjectDao(authState.uid).valueChanges()
        .pipe(take(1))
        .subscribe(val => {
          if (!val) {
            this.create(authState);
          }
        });
  }

  getByEmail(email: string): Observable<User> {
    const queryFn = ref => ref.orderByChild('email').equalTo(email);
    return this.queryList(queryFn).map(result => result[0]);
  }
}
