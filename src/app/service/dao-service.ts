import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
  QueryFn
} from '@angular/fire/database';
import {ThenableReference} from 'firebase/database';
import {transformSnapshotAction, transformSnapshotActionList} from '../utility/snapshot-tranform';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

export abstract class DaoService<T> {
  constructor(protected db: AngularFireDatabase,
              protected ref: string) {}

  get(id: string): Observable<T> {
    return this.getObjectDao(id)
      .snapshotChanges().pipe(map(transformSnapshotAction));
  }

  add(obj: T): ThenableReference {
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

  queryList(queryFn: QueryFn): Observable<T[]> {
    return this.db.list(this.ref, queryFn)
        .snapshotChanges().pipe(map(transformSnapshotActionList));
  }

  protected getObjectDao(id: string): AngularFireObject<T> {
    return this.db.object<T>(`${this.ref}/${id}`);
  }

  protected getListDao(): AngularFireList<T> {
    console.log('getListDao', this.ref)
    return this.db.list<T>(`${this.ref}`);
  }

  protected getKeyedListDao(): Observable<T[]> {
    console.log('getKeyedListDao', this.ref)
    return this.db.list<T>(`${this.ref}`)
        .snapshotChanges().pipe(map(transformSnapshotActionList));
  }
}
