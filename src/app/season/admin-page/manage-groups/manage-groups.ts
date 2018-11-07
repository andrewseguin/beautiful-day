import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GroupsDao} from 'app/season/dao';
import {Permissions} from 'app/season/services/permissions';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.scss'],
  templateUrl: 'manage-groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroups {
  admins = this.groupsDao.get('admins');
  acquisitions = this.groupsDao.get('acquisitions');
  approvers = this.groupsDao.get('approvers');

  constructor(public groupsDao: GroupsDao,
              public permissions: Permissions) {}

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}
