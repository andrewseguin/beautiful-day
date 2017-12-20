import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import {DaoService} from './dao-service';
import {from} from 'rxjs/observable/from';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class UsersService extends DaoService<User> {
  constructor(protected db: AngularFireDatabase, private auth: AngularFireAuth) {
    super(db, 'users');
  }

  create(authState: firebase.User) {
    this.getObjectDao(authState.uid).set({
      uid: authState.uid,
      email: authState.email,
      name: authState.displayName,
      pic: authState.photoURL
    });
  }

  getByEmail(email: string): Observable<User> {
    const queryFn = ref => ref.orderByChild('email').equalTo(email);
    return this.queryList(queryFn).map(result => result[0]);
  }

  getCurrentUser(): Observable<User> {
    return this.auth.authState.pipe(mergeMap(auth => {
      return auth ? this.getByEmail(auth.email) : from([null]);
    }));
  }
}
