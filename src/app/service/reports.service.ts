import {Injectable} from '@angular/core';
import {AngularFireDatabase,} from '@angular/fire/database';
import {QueryStage, Report} from 'app/model/report';
import {DaoService} from './dao-service';
import {User} from 'app/model/user';
import {Observable} from 'rxjs/Observable';
import {AuthService} from 'app/service/auth-service';

@Injectable()
export class ReportsService extends DaoService<Report> {
  user: User;
  reports: Observable<Report[]>;

  constructor(db: AngularFireDatabase, private authService: AuthService) {
    super(db, 'reports');
    this.reports = this.getKeyedListDao();
    this.authService.user.subscribe(user => this.user = user);
  }

  update(id, update: Report): void {
    update.modifiedBy = this.user.email;
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
      season: '2018',
    };

    return super.add(newReport);
  }
}
