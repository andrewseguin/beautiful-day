import {Component} from '@angular/core';
import {GroupsDao} from 'app/ui/season/dao';
import {PermissionsService} from 'app/ui/season/services/permissions.service';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.component.scss'],
  templateUrl: 'manage-groups.component.html'
})
export class ManageGroupsComponent {
  admins = this.groupsDao.get('admins');
  acquisitions = this.groupsDao.get('acquisitions');
  approvers = this.groupsDao.get('approvers');
  owners = this.groupsDao.get('owners');

  constructor(public groupsDao: GroupsDao,
              public permissionsService: PermissionsService) {}

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}
