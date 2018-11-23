import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export type GroupId = 'owners' | 'admins' | 'acquisitions' | 'approvers';

export interface Group {
  id?: GroupId;
  users?: string[];
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class GroupsDao extends SeasonCollectionDao<Group> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'groups');
  }
}
