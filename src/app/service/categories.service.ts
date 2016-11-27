import { Injectable } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Category} from "../model/category";

@Injectable()
export class CategoriesService {
  constructor(private af: AngularFire) {}

  getCategories(): FirebaseListObservable<Category[]> {
    return this.af.database.list('categories');
  }

  getCategory(id: string): FirebaseObjectObservable<Category> {
    return this.af.database.object(`categories/${id}`);
  }
}
