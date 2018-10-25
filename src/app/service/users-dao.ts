import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/utility/list-dao';
import {User} from 'app/model/user';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {User as FirebaseUser} from 'firebase/auth';

@Injectable()
export class UsersDao extends ListDao<User> {
  constructor(afs: AngularFirestore) {
    super(afs);
    this.path = 'users';
  }

  getByEmail(email: string): Observable<User> {
    const queryFn = ref => ref.where('email', '==', email);
    return this.afs.collection(this.path, queryFn).valueChanges()
        .pipe(map(result => result[0]));
  }

  /** Checks if the user is in the DB and if not, add their info. */
  addUserData(authState: FirebaseUser) {
    this.get(authState.uid)
      .pipe(take(1))
      .subscribe(val => {
        if (!val) {
          this.create(authState);
        } else {
          this.update(authState.uid, {pic: authState.photoURL});
        }
      });
  }

  private create(authState: FirebaseUser) {
    this.add({
      id: authState.id,
      uid: authState.uid,
      email: authState.email,
      name: authState.displayName,
      pic: authState.photoURL
    });
  }

}
