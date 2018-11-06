import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export class Event {
  id?: string;
  date?: string; // String is the date stored with toISOString()
  time?: string;
  info?: string;
}

@Injectable()
export class EventsDao extends SeasonCollectionDao<Event> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'events');
  }
}
