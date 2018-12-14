import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {takeUntil} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {sendEvent} from './analytics';

export interface IdentifiedObject {
  id?: string;
  dateCreated?: string;
  dateModified?: string;
}

export abstract class ListDao<T extends IdentifiedObject> {
  private needsSubscription = false;

  protected destroyed = new Subject();

  private subscription: Subscription;

  get list(): BehaviorSubject<T[]|null> {
    if (!this.subscription) {
      this.subscribe();
    }
    return this._list;
  }
  _list = new BehaviorSubject<T[]>(null);

  get map(): BehaviorSubject<Map<string, T>> {
    if (!this.subscription) {
      this.subscribe();
    }

    if (!this._map) {
      this._map = new BehaviorSubject<Map<string, T>>(new Map());
      this.list.subscribe(list => {
        if (list) {
          const map = new Map<string, T>();
          list.forEach(obj => map.set(obj.id, obj));
          this._map.next(map);
        } else {
          this._map.next(null);
        }
      });
    }

    return this._map;
  }
  _map: BehaviorSubject<Map<string, T>>;

  set path(path: string) {
    this._path = path;
    this.collection = this.afs.collection<T>(path);

    // If a list has already been accessed, unsubscribe from the previous collection and
    // get values from the new collection
    if (this.subscription || this.needsSubscription) {
      this.subscribe();
      this.needsSubscription = false;
    }
  }
  get path(): string { return this._path; }
  _path: string;

  protected collection: AngularFirestoreCollection<T>;

  protected constructor(protected afs: AngularFirestore,
                        protected afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(auth => {
      if (!auth) {
        this.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }

  add(obj: T): Promise<string>;
  add(objs: T[]): Promise<any[]>;
  add(objOrObjs: T | T[]): Promise<string> | Promise<any[]> {
    if (objOrObjs instanceof Array) {
      objOrObjs.forEach(() => this.sendDaoEvent('add'));
      return performBatchedOperation(objOrObjs, (batch, chunk) => {
        chunk.forEach(obj => {
          this.decorateForAdd(obj);
          const doc = this.collection.doc(obj.id);
          batch.set(doc.ref, obj);
        });
      });
    } else {
      const obj = objOrObjs;
      this.decorateForAdd(obj);
      this.sendDaoEvent('add');
      return this.collection.doc(obj.id).set(obj).then(() => obj.id);
    }
  }

  get(id: string): Observable<T> {
    return this.collection.doc<T>(id).valueChanges().pipe(takeUntil(this.destroyed));
  }

  update(id: string, update: T): Promise<void>;
  update(ids: string[], update: T): Promise<any[]>;
  update(idOrIds: string | string[], update: T): Promise<void> | Promise<any[]> {
    update.dateModified = new Date().toISOString();

    if (idOrIds instanceof Array) {
      idOrIds.forEach(() => this.sendDaoEvent('update'));
      return performBatchedOperation(idOrIds, (batch, chunk) => {
        chunk.forEach(id => {
          const doc = this.collection.doc(id);
          batch.update(doc.ref, update);
        });
      });
    } else {
      this.sendDaoEvent('update');
      return this.collection.doc(idOrIds).update(update);
    }

    // If the doc doesn't exist, the update will fail. To mitigate this,
    // you can use `this.collection.doc(id).set(update, {merge: true});`
    // However, this has the side effect of always merging any nested objects.
  }

  remove(id: string): Promise<void>;
  remove(ids: string[]): Promise<any[]>;
  remove(idOrIds: string | string[]) {
    if (idOrIds instanceof Array) {
      idOrIds.forEach(() => this.sendDaoEvent('remove'));
      return performBatchedOperation(idOrIds, (batch, chunk) => {
        chunk.forEach(id => {
          const doc = this.collection.doc(id);
          batch.delete(doc.ref);
        });
      });
    } else {
      this.sendDaoEvent('remove');
      return this.collection.doc(idOrIds).delete();
    }
  }

  private subscribe() {
    // Unsubscribe from the current collection
    this.unsubscribe();

    if (!this.collection) {
      this.needsSubscription = true;
    } else {
      this.subscription = this.collection.valueChanges()
          .subscribe(v => this._list.next(v));
    }
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this._list.next(null);
    }
  }

  private decorateForAdd(obj: T) {
    if (!obj.id) {
      obj.id = this.afs.createId();
    }

    obj.dateCreated = new Date().toISOString();
    obj.dateModified = new Date().toISOString();
  }

  private sendDaoEvent(action: 'add' | 'update' | 'remove') {
    sendEvent(this.path, `db_${action}`);
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
