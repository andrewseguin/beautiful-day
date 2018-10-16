import {Injectable} from '@angular/core';
import {AngularFireDatabase,} from '@angular/fire/database';
import {Report} from 'app/model/report';
import {DaoService} from './dao-service';
import {User} from 'app/model/user';
import {AuthService} from 'app/service/auth-service';
import {BehaviorSubject, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import {RequestRendererOptionsState} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';

@Injectable()
export class ReportsService extends DaoService<Report> {
  user: User;
  reports = new BehaviorSubject<Report[]>([]);

  private destroyed = new Subject();

  constructor(db: AngularFireDatabase, private authService: AuthService) {
    super(db, 'reports');

    this.getKeyedListDao()
        .pipe(takeUntil(this.destroyed))
        .subscribe(reports => {
          console.log('Loaded all reports');
          this.reports.next(reports);
        });

    this.authService.user
        .pipe(takeUntil(this.destroyed))
        .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  update(id, update: Report): void {
    update.modifiedBy = this.user.email;
    update.modifiedDate = new Date().getTime().toString();
    super.update(id, update);
  }

  create(name: string, options: RequestRendererOptionsState) {
    const newReport: Report = {
      name,
      createdBy: this.user.email,
      modifiedBy: this.user.email,
      createdDate: new Date().getTime().toString(),
      modifiedDate: new Date().getTime().toString(),
      season: '2018',
      options,
    };

    return super.add(newReport);
  }

  get(id: string) {
    return super.get(id).pipe(map(report => {
      // If a report is saved with an empty array of filters,
      // it just doesn't save. In this case, add in the empty array.
      if (!report.options.filters) {
        report.options.filters = [];
      }
      return report;
    }));
  }
}
