import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/utility/list-dao';
import {from, Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';

export interface User {
  id?: string;
  email?: string;
  name?: string;
  pic?: string;
  phone?: string;
  isOwner?: boolean;
  lightTheme?: boolean;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class UsersDao extends ListDao<User> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, afAuth, of('users'));
  }

  getByEmail(email: string): Observable<User> {
    const queryFn = ref => ref.where('email', '==', email);
    return this.path.pipe(
      switchMap(path => this.afs.collection(path, queryFn).valueChanges()),
      map(result => result[0]));
  }

  /** Checks if the user is in the DB and if not, add their info. */
  addUserData(authState: firebase.User) {
    this.get(authState.uid)
      .pipe(take(1))
      .subscribe(val => {
        if (!val) {
          const newUser: User = {
            id: authState.uid,
            email: authState.email,
            pic: authState.photoURL,
          };

          if (authState.phoneNumber) {
            newUser.phone = authState.phoneNumber;
          }

          if (authState.displayName) {
            newUser.name = authState.displayName;
          }

          this.add(newUser);
        } else {
          this.update(authState.uid, {pic: authState.photoURL});
        }
      });
  }

}
