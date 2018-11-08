import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Group, GroupsDao} from 'app/season/dao';
import {Permissions} from 'app/season/services/permissions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.scss'],
  templateUrl: 'manage-groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroups {
  private pipeUsers = map((v: Group) => v ? v.users : []);

  groups = [
    {id: 'acquisitions', users: this.groupsDao.get('acquisitions').pipe(this.pipeUsers)},
    {id: 'approvers', users: this.groupsDao.get('approvers').pipe(this.pipeUsers)},
    {id: 'admins', users: this.groupsDao.get('admins').pipe(this.pipeUsers)},
  ];

  constructor(public groupsDao: GroupsDao,
              public permissions: Permissions) {}

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}
