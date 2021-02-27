import {Injectable} from '@angular/core';
import {ListDao} from 'app/utility/list-dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {of} from 'rxjs';

export interface Season {
  id: string;
  name: string;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class SeasonsDao extends ListDao<Season> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth) {
    super(afs, afAuth, of('seasons'));
  }
}
