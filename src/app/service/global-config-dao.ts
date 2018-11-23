import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/utility/list-dao';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

export interface GlobalConfig {
  id?: string;
  value?: any;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class GlobalConfigDao extends ListDao<GlobalConfig> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, afAuth);
    this.path = 'config';
  }
}
