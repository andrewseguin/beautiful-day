import {Injectable} from "@angular/core";
import {
  AngularFireDatabase, FirebaseAuthState, AngularFireAuth,
  FirebaseObjectObservable
} from "angularfire2";
import {User} from "../model/user";
import {Observable} from "rxjs";

@Injectable()
export class UsersService {
  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth) { }

  create(authState: FirebaseAuthState) {
    this.getByUid(authState.uid).set({
      uid: authState.uid,
      email: authState.auth.email,
      name: authState.auth.displayName,
      pic: authState.auth.photoURL
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
    return this.auth.flatMap(auth => {
      return auth ? this.get(auth.auth.email) : Observable.from([null]);
    });
  }
}
