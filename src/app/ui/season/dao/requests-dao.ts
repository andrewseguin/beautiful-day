import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Request} from 'app/model';
import {Observable} from 'rxjs';
import {SeasonCollectionDao} from './season-collection-dao';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {AngularFireAuth} from '@angular/fire/auth';

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

