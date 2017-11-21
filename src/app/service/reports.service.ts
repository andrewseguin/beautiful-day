import {Injectable} from '@angular/core';
import {
  AngularFireDatabase, AngularFireList, AngularFireObject,
} from 'angularfire2/database';
import {QueryStage, Report} from '../model/report';

@Injectable()
export class ReportsService {

  constructor(private db: AngularFireDatabase) { }

  getAll(): AngularFireList<Report> {
    return this.db.list('reports');
  }

  get(id: string): AngularFireObject<Report> {
    return this.db.object(`reports/${id}`);
  }

  update(id, update: Report): void {
    update.modifiedDate = new Date().getTime().toString();
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

    return this.getAll().push(newReport);
  }
}
