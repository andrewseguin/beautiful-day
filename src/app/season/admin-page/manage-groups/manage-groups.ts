import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GroupsDao} from 'app/season/dao';
import {Permissions} from 'app/season/services/permissions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'manage-groups',
  styleUrls: ['manage-groups.scss'],
  templateUrl: 'manage-groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageGroups {
  groups = this.groupsDao.map.pipe(map(groupsMap => {
    if (!groupsMap) {
      return [];
    }

    return [
      {
        id: 'acquisitions',
        users: (groupsMap.get('acquisitions') || {}).users || []
      },
      {
        id: 'approvers',
        users: (groupsMap.get('approvers') || {}).users || []
      },
      {
        id: 'admins',
        users: (groupsMap.get('admins') || {}).users || []
      },
    ];
  }));

  constructor(public groupsDao: GroupsDao,
              public permissions: Permissions) {
  }

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}
