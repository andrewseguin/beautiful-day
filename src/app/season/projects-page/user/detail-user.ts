import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy
} from '@angular/core';
import {Subject} from 'rxjs';
import {User, UsersDao} from 'app/service/users-dao';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'detail-user',
  templateUrl: 'detail-user.html',
  styleUrls: ['detail-user.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailUser implements OnDestroy {
  user: User;

  _userEmail: string;
  @Input('userEmail') set userEmail(userEmail: string) {
    this._userEmail = userEmail;
    this.user = null;
    if (!this._userEmail) { return; }

    this.usersDao.getByEmail(this.userEmail)
        .pipe(takeUntil(this.destroyed))
        .subscribe(user => {
          this.user = user ? user : {email: this.userEmail};
          this.cd.markForCheck();
        });
  }
  get userEmail(): string { return this._userEmail; }

  @Input() group: 'lead' | 'director' | 'acquisitions';

  private destroyed = new Subject();

  constructor(private usersDao: UsersDao,
              private cd: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
