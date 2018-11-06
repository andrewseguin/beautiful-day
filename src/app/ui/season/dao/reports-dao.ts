import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';
import {RequestRendererOptionsState} from '../shared/requests-list/render/request-renderer-options';

export interface Report {
  id?: string;
  name?: string;
  group?: string;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  season?: string;
  options?: RequestRendererOptionsState;
}

@Injectable()
export class ReportsDao extends SeasonCollectionDao<Report> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'reports');
  }
}
