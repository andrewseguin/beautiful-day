import {Component} from '@angular/core';
import {GroupsDao} from 'app/ui/season/dao';
import {Permissions} from 'app/ui/season/services/permissions';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.scss'],
  templateUrl: 'manage-groups.html'
})
export class ManageGroups {
  admins = this.groupsDao.get('admins');
  acquisitions = this.groupsDao.get('acquisitions');
  approvers = this.groupsDao.get('approvers');
  owners = this.groupsDao.get('owners');

  constructor(public groupsDao: GroupsDao,
              public permissions: Permissions) {}

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}
