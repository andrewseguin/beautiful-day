import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';

export type GroupId = 'owners' | 'admins' | 'acquisitions' | 'approvers';

export interface Group {
  id?: GroupId;
  users?: string[];
}

@Injectable()
export class GroupsDao extends SeasonCollectionDao<Group> {
  constructor(afs: AngularFirestore, activatedSeason: ActivatedSeason) {
    super(afs, activatedSeason, 'groups');
  }
}
