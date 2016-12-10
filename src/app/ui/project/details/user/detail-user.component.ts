import {Component, OnInit, Input} from '@angular/core';
import {UsersService} from '../../../../service/users.service';
import {User} from '../../../../model/user';

@Component({
  selector: 'detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.scss']
})
export class DetailUserComponent implements OnInit {
  user: User;

  @Input('userEmail') userEmail: string;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    if (this.userEmail) {
      this.usersService.get(this.userEmail).subscribe(user => {
        this.user = user ? user : {email: this.userEmail};
      })
    }
  }

}
