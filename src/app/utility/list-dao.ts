import {Observable, Subject} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase/app';
import {sendEvent} from './analytics';
import {Injectable} from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';

export interface IdentifiedObject {
  id?: string;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export abstract class ListDao<T extends IdentifiedObject> {
  collection: Observable<AngularFirestoreCollection<T>>;
  list: Observable<T[]>;
  map: Observable<Map<string, T>>;

  protected destroyed = new Subject();

  protected constructor(protected afs: AngularFirestore,
                        protected afAuth: AngularFireAuth,
                        protected path: Observable<string>) {
    this.collection = path.pipe(
      filter(p => !!p),
      map(path => this.afs.collection<T>(path)));

    this.list = this.afAuth.authState.pipe(
      filter(authState => !!authState),
      switchMap(() => this.collection),
      switchMap(collection => collection.valueChanges()),
    );

    this.map = this.list.pipe(map(values => {
      const map = new Map<string, T>();
      values.forEach(obj => map.set(obj.id, obj));
      return map;
    }));
  }

  add(obj: T): Promise<string>;
  add(objs: T[]): Promise<any[]>;
  add(objOrObjs: T | T[]): Promise<string|any[]> {
    return this.collection.pipe(
      take(1),
      switchMap(collection => {
        if (objOrObjs instanceof Array) {
          objOrObjs.forEach(() => this.sendDaoEvent('add'));
          return fromPromise(performBatchedOperation(objOrObjs, (batch, chunk) => {
            chunk.forEach(obj => {
              this.decorateForAdd(obj);
              const doc = collection.doc(obj.id);
              batch.set(doc.ref, obj);
            });
          }));
        } else {
          const obj = objOrObjs;
          this.decorateForAdd(obj);
          this.sendDaoEvent('add');
          return fromPromise(collection.doc(obj.id).set(obj).then(() => obj.id));
        }
      })).toPromise();
  }

  get(id: string): Observable<T> {
    return this.collection.pipe(
      switchMap(collection => collection.doc<T>(id).valueChanges()));
  }

  update(id: string, update: T): Promise<void>;
  update(ids: string[], update: T): Promise<any[]>;
  update(idOrIds: string | string[], update: T): Promise<void|any[]> {
    return this.collection.pipe(
      take(1),
      switchMap(collection => {
        update.dateModified = new Date().toISOString();

        if (idOrIds instanceof Array) {
          idOrIds.forEach(() => this.sendDaoEvent('update'));
          return performBatchedOperation(idOrIds, (batch, chunk) => {
            chunk.forEach(id => {
              const doc = collection.doc(id);
              batch.update(doc.ref, update);
            });
          });
        } else {
          this.sendDaoEvent('update');
          return collection.doc(idOrIds).update(update);
        }
      })).toPromise();

    // If the doc doesn't exist, the update will fail. To mitigate this,
    // you can use `this.collection.doc(id).set(update, {merge: true});`
    // However, this has the side effect of always merging any nested objects.
  }

  remove(id: string): Promise<void>;
  remove(ids: string[]): Promise<any[]>;
  remove(idOrIds: string | string[]) {
    return this.collection.pipe(
      take(1),
      switchMap(collection => {
        if (idOrIds instanceof Array) {
          idOrIds.forEach(() => this.sendDaoEvent('remove'));
          return performBatchedOperation(idOrIds, (batch, chunk) => {
            chunk.forEach(id => {
              const doc = collection.doc(id);
              batch.delete(doc.ref);
            });
          });
        } else {
          this.sendDaoEvent('remove');
          return collection.doc(idOrIds).delete();
        }
      })).toPromise();
  }

  private decorateForAdd(obj: T) {
    if (!obj.id) {
      obj.id = this.afs.createId();
    }

    if (!obj.dateCreated) {
      obj.dateCreated = new Date().toISOString();
    }
    obj.dateModified = new Date().toISOString();
  }

  private sendDaoEvent(action: 'add' | 'update' | 'remove') {
    this.path.pipe(take(1)).subscribe(path => sendEvent(path, `db_${action}`));
  }
}

function performBatchedOperation(list: any[],
    operation: (batch: firebase.firestore.WriteBatch, chunk: any[]) => void): Promise<any[]> {
  const promises = [];
  const chunkSize = 500;
  for (let i = 0; i < list.length; i += chunkSize) {
    const chunk = list.slice(i, i + chunkSize);

    const batch = firebase.firestore().batch();
    operation(batch, chunk);
    const promise = batch.commit();
    promises.push(promise);
  }

  return Promise.all(promises);
}
