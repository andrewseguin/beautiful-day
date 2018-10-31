import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

export interface IdentifiedObject {
  id?: string;
}

export abstract class ListDao<T extends IdentifiedObject> {
  needsSubscription = true;

  subscription: Subscription;
  get list(): BehaviorSubject<T[]|null> {
    if (!this.subscription) {
      this.subscribe();
    }
    return this._list;
  }
  _list = new BehaviorSubject<T[]>(null);

  get map(): BehaviorSubject<Map<string, T>> {
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

  protected constructor(protected afs: AngularFirestore) {}

  add(obj: T): Promise<string> {
    if (!obj.id) {
      obj.id = this.afs.createId();
    }

    return this.collection.doc(obj.id).set(obj).then(() => obj.id);
  }

  get(id: string): Observable<T> {
    return this.collection.doc<T>(id).valueChanges();
  }

  update(id: string, update: T) {
    this.collection.doc(id).update(update);
  }

  remove (id: string) {
    this.collection.doc(id).delete();
  }

  private subscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this._list.next(null);
    }

    console.log('Loading list:', this.path);

    if (!this.collection) {
      this.needsSubscription = true;
    } else {
      this.subscription = this.collection.valueChanges()
          .subscribe(v => this._list.next(v));
    }
  }
}
