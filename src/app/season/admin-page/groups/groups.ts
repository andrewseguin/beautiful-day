import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Group, GroupsDao} from 'app/season/dao';
import {Permissions} from 'app/season/services/permissions';
import {map} from 'rxjs/operators';

@Component({
  selector: 'groups',
  styleUrls: ['groups.scss'],
  templateUrl: 'groups.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Groups {
  acquisitions = this.groupsDao.map.pipe(getGroup('acquisitions'));
  approvers = this.groupsDao.map.pipe(getGroup('approvers'));
  admins = this.groupsDao.map.pipe(getGroup('admins'));


  constructor(public groupsDao: GroupsDao,
              public permissions: Permissions) {
  }

  update(id: string, users: string[]) {
    this.groupsDao.update(id, {users});
  }
}

function getGroup(group: string) {
  return map((groupsMap: Map<string, Group>) => {
    if (!groupsMap) {
      return [];
    }

    return (groupsMap.get(group) || {}).users || [];
  })
}
