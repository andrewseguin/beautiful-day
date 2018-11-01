import {ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {User} from 'app/model/user';
import {Subject} from 'rxjs';
import {UsersDao} from 'app/service/users-dao';

@Component({
  selector: 'detail-user',
  templateUrl: 'detail-user.html',
  styleUrls: ['detail-user.scss']
})
export class DetailUser implements OnDestroy {
  user: User;

  _userEmail: string;
  @Input('userEmail') set userEmail(userEmail: string) {
    this._userEmail = userEmail;
    this.user = null;
    if (!this._userEmail) { return; }

    this.usersDao.getByEmail(this.userEmail).subscribe(user => {
      this.user = user ? user : {email: this.userEmail};
      this.changeDetectorRef.markForCheck();
    });
  }
  get userEmail(): string { return this._userEmail; }

  @Input() group: 'lead' | 'director' | 'acquisitions';

  private destroyed = new Subject();

  constructor(private usersDao: UsersDao,
              private changeDetectorRef: ChangeDetectorRef) {}

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
