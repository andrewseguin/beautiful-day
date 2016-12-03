import {Injectable} from '@angular/core';
import {FirebaseObjectObservable, FirebaseListObservable, AngularFire} from "angularfire2";
import {Item} from "../model/item";

@Injectable()
export class ItemsService {

  constructor(private af: AngularFire) {}

  getItems(): FirebaseListObservable<Item[]> {
    return this.af.database.list('items');
  }

  getItem(id: string): FirebaseObjectObservable<Item> {
    return this.af.database.object(`items/${id}`);
  }
}
