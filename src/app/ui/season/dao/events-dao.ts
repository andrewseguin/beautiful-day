import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Event} from 'app/model';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';

@Injectable()
export class EventsDao extends SeasonCollectionDao<Event> {
  constructor(afs: AngularFirestore, activatedSeason: ActivatedSeason) {
    super(afs, activatedSeason, 'events');
  }
}
