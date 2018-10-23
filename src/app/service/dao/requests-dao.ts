import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/service/dao/list-dao';
import {Request} from 'app/model';
import {Observable} from 'rxjs';

@Injectable()
export class RequestsDao extends ListDao<Request> {
  constructor(afs: AngularFirestore) {
    super(afs, 'requests');
  }

  getByProject(projectId: string): Observable<Request[]> {
    const queryFn = ref => ref.where('project', '==', projectId);
    return this.afs.collection('requests', queryFn).valueChanges();
  }
}

