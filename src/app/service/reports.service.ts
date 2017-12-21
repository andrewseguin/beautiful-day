import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, } from 'angularfire2/database';
import {QueryStage, Report} from 'app/model/report';
import {DaoService} from './dao-service';
import {UsersService} from './users.service';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ReportsService extends DaoService<Report> {
  user: User;
  reports: Observable<Report[]>;

  constructor(db: AngularFireDatabase, private usersService: UsersService) {
    super(db, 'reports');
    this.reports = this.getKeyedListDao();
    this.usersService.getCurrentUser().subscribe(user => this.user = user);
  }

  getAll(): AngularFireList<Report> {
    return this.db.list('reports');
  }

  update(id, update: Report): void {
    update.modifiedDate = new Date().getTime().toString();
    super.update(id, update);
  }

  add(report?: Report) {
    const emptyQueryStage: QueryStage = {
      querySet: [{queryString: '', type: 'any'}],
      exclude: false,
    };

    const newReport: Report = {
      name: report ? `Copy of ${report.name}` : 'New Report',
      queryStages: report ? report.queryStages : [emptyQueryStage],
      createdBy: this.user.email,
      modifiedBy: this.user.email,
      createdDate: new Date().getTime().toString(),
      modifiedDate: new Date().getTime().toString(),
    };

    return super.add(newReport);
  }
}
