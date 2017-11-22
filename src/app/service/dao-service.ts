import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import * as firebase from 'firebase';
import {transformSnapshotAction, transformSnapshotActionList} from '../utility/snapshot-tranform';
import {Observable} from 'rxjs/Observable';

export abstract class DaoService<T> {
  constructor(protected db: AngularFireDatabase,
              protected ref: string) {}

  get(id: string): Observable<T> {
    return this.getObjectDao(id)
      .snapshotChanges().map(transformSnapshotAction);
  }

  add(obj: T): firebase.database.ThenableReference {
    return this.getListDao().push(obj);
  }

  remove(id: string) {
    this.getObjectDao(id).remove();
  }

  /** Updates the values passed through the update object. */
  update(id: string, update: T) {
    this.getObjectDao(id).update(update);
  }

  /** Sets the object exactly as provided. */
  set(id: string, update: T) {
    this.getObjectDao(id).set(update);
  }

  protected getObjectDao(id: string): AngularFireObject<T> {
    return this.db.object<T>(`${this.ref}/${id}`);
  }

  protected getListDao(): AngularFireList<T> {
    return this.db.list<T>(`${this.ref}`);
  }

  protected getKeyedListDao(): Observable<T[]> {
    return this.db.list<T>(`${this.ref}`)
      .snapshotChanges().map(transformSnapshotActionList);
  }
}
