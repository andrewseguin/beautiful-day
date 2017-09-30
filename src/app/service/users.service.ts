import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import {User} from '../model/user';
import {Observable} from 'rxjs';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';

@Injectable()
export class UsersService {
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  create(authState: firebase.User) {
    this.getByUid(authState.uid).set({
      uid: authState.uid,
      email: authState.email,
      name: authState.displayName,
      pic: authState.photoURL
    });
  }

  getByUid(uid: string): FirebaseObjectObservable<User> {
    return this.db.object(`users/${uid}`);
  }

  get(email: string): Observable<User> {
    return this.db.list('users', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    }).map(result => result[0]);
  }

  update(uid: string, update: any) {
    this.getByUid(uid).update(update);
  }

  getCurrentUser(): Observable<User> {
    return this.auth.authState.flatMap(auth => {
      return auth ? this.get(auth.email) : Observable.from([null]);
    });
  }
}
