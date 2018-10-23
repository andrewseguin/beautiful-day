import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/service/dao/list-dao';
import {Report} from 'app/model';

@Injectable()
export class ReportsDao extends ListDao<Report> {
  constructor(afs: AngularFirestore) {
    super(afs, 'reports');
  }
}
