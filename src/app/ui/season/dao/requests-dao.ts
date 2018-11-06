import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {SeasonCollectionDao} from './season-collection-dao';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Request {
  id?: string;
  project?: string;
  item?: string;
  dropoff?: string;
  quantity?: number;
  note?: string;
  date?: string;
  tags?: string[];
  purchaser?: string;
  isPurchased?: boolean;
  isApproved?: boolean;
  allocation?: number;
  distributionDate?: string;
  isDistributed?: boolean;
}

@Injectable()
export class RequestsDao extends SeasonCollectionDao<Request> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'requests');
  }

  getByProject(projectId: string): Observable<Request[]> {
    const queryFn = ref => ref.where('project', '==', projectId);
    return this.afs.collection(this.path, queryFn).valueChanges();
  }
}

