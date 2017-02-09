import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import {Report, QueryStage} from "../model/report";

@Injectable()
export class ReportsService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): FirebaseListObservable<Report[]> {
    return this.db.list('reports');
  }

  get(id: string): FirebaseObjectObservable<Report> {
    return this.db.object(`reports/${id}`);
  }

  update(id, update: any): void {
    this.get(id).update(update);
  }

  remove(id: string) {
    this.get(id).remove();
  }

  create(user: string, optReportTemplate?: Report) {
    const emptyQueryStage: QueryStage = {
      querySet: [{queryString: '', type: 'any'}],
      exclude: false,
    };

    const newReport: Report = {
      name: optReportTemplate ? `Copy of ${optReportTemplate.name}` : 'New Report',
      queryStages: optReportTemplate ? optReportTemplate.queryStages : [emptyQueryStage],
      createdBy: user,
      modifiedBy: user,
      createdDate: new Date().getTime().toString(),
      modifiedDate: new Date().getTime().toString(),
    };

    return this.getAll().push(newReport)
  }
}
