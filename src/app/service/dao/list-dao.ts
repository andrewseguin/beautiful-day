import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

export interface IdentifiedObject {
  id?: string;
}

export abstract class ListDao<T extends IdentifiedObject> {
  get list(): BehaviorSubject<T[]|null> {
    if (!this._list) {
      this._list = new BehaviorSubject<T[]>(null);
      console.log('Loading list:', this.path);
      this.collection.valueChanges().subscribe(v => this._list.next(v));
    }
    return this._list;
  }
  _list: BehaviorSubject<T[]|null>;

  get map(): BehaviorSubject<Map<string, T>> {
    if (!this._map) {
      this._map = new BehaviorSubject<Map<string, T>>(new Map());
      this.list.subscribe(projects => {
        const map = new Map<string, T>();
        projects.forEach(p => map.set(p.id, p));
        this._map.next(map);
      });
    }

    return this._map;
  }
  _map: BehaviorSubject<Map<string, T>>;

  protected collection: AngularFirestoreCollection<T>;

  protected constructor(protected afs: AngularFirestore,
                        private path: string) {
    this.collection = this.afs.collection<T>(this.path);
  }

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
}
