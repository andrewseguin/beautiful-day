import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseAuthState, FirebaseObjectObservable} from "angularfire2";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable()
export class UsersService {
  constructor(private db: AngularFireDatabase) { }

  create(authState: FirebaseAuthState) {
    this.db.object(`users/${authState.uid}`).set({
      uid: authState.uid,
      email: authState.auth.email,
      name: authState.auth.displayName,
      pic: authState.auth.photoURL
    });
  }

  get(email: string): Observable<FirebaseObjectObservable<User>> {
    return this.db.list('users', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    }).map(result => result[0]);
  }

  update(uid: string, update: any) {
    this.db.object(`users/${uid}`).update(update);
  }
}
