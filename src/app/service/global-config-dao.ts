import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/utility/list-dao';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {of} from 'rxjs';

export interface GlobalConfig {
  id?: string;
  value?: any;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class GlobalConfigDao extends ListDao<GlobalConfig> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, afAuth, of('config'));
  }
}
