import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Report} from "../model/report";

@Injectable()
export class ReportsService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): FirebaseListObservable<Report[]> {
    return this.db.list('reports');
  }

  get(id: string): FirebaseObjectObservable<Report> {
    return this.db.object(`reports/${id}`);
  }

  update(id, update: Report): void {
    this.get(id).update(update);
  }

  remove(id: string) {
    this.get(id).remove();
  }

  create() {
    return this.getAll().push({
      name: 'New Report',
      queryStages: [{querySet: ['']}]
    })
  }
}
