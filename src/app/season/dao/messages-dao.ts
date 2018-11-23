import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export class Message {
  id?: string;
  text?: string;
  enabled?: boolean;
  bgColor?: string;
  viewedBy?: string[];
  dismissedBy?: string[];
  creationTime?: string; // String is the date stored with toISOString()
}

@Injectable()
export class MessagesDao extends SeasonCollectionDao<Message> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'messages');
  }
}
