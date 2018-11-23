import {AngularFirestore} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from 'app/season/dao/season-collection-dao';

export interface Config {
  id?: string;
  value?: any;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class ConfigDao extends SeasonCollectionDao<Config> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'config');
  }
}

