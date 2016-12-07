import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseAuthState} from "angularfire2";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable()
export class UsersService {
  constructor(private db: AngularFireDatabase) { }

  create(authState: FirebaseAuthState) {
    this.db.list('users').push({
      uid: authState.uid,
      email: authState.auth.email,
      name: authState.auth.displayName,
      pic: authState.auth.photoURL
    });
  }

  get(email: string): Observable<User> {
    return this.db.list('users', {
      query: {
        orderByChild: 'email',
        equalTo: email
      }
    }).map(result => result[0]);
  }
}
