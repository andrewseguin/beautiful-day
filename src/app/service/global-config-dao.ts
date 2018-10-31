import {AngularFirestore} from '@angular/fire/firestore';
import {ListDao} from 'app/utility/list-dao';
import {Injectable} from '@angular/core';

export interface GlobalConfig {
  id?: string;
  value?: any;
}

@Injectable()
export class GlobalConfigDao extends ListDao<GlobalConfig> {
  constructor(afs: AngularFirestore) {
    super(afs);
    this.path = 'config';
  }
}
