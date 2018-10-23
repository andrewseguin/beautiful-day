import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Item} from 'app/model';
import {ListDao} from 'app/service/dao/list-dao';

@Injectable()
export class ItemsDao extends ListDao<Item> {
  constructor(afs: AngularFirestore) {
    super(afs, 'items');
  }
}
