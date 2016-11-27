import {Injectable} from '@angular/core';
import {FirebaseObjectObservable, FirebaseListObservable, AngularFire} from "angularfire2";

@Injectable()
export class ItemsService {

  constructor(private af: AngularFire) {}

  getItems(): FirebaseListObservable<any[]> {
    return this.af.database.list('items');
  }

  getItem(id: string): FirebaseObjectObservable<any> {
    return this.af.database.object(`items/${id}`);
  }
}
