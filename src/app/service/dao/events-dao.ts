import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Event} from 'app/model';
import {ListDao} from 'app/service/dao/list-dao';

@Injectable()
export class EventsDao extends ListDao<Event> {
  constructor(afs: AngularFirestore) {
    super(afs, 'events');
  }
}
