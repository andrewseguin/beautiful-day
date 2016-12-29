import {Component, Input} from '@angular/core';
import {UsersService} from '../../../../../service/users.service';
import {User} from '../../../../../model/user';

@Component({
  selector: 'detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent {
  user: User;

  _userEmail: string;
  @Input('userEmail') set userEmail(userEmail: string) {
    this._userEmail = userEmail;
    this.user = null;
    if (!this._userEmail) return;

    this.usersService.get(this.userEmail).subscribe(user => {
      this.user = user ? user : {email: this.userEmail};
    });
  }
  get userEmail(): string { return this._userEmail; }

  constructor(private usersService: UsersService) { }
}
