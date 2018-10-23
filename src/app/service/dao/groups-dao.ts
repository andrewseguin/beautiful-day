import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/service/dao/list-dao';

export type GroupId = 'owners' | 'admins' | 'acquisitions' | 'approvers';

export interface Group {
  id?: GroupId;
  users?: string[];
}

@Injectable()
export class GroupsDao extends ListDao<Group> {
  constructor(afs: AngularFirestore) {
    super(afs, 'groups');
  }
}
