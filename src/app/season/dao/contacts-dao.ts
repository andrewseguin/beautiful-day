import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Contact {
  id?: string;
  name?: string;
  title?: string;
  email?: string;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class ContactsDao extends SeasonCollectionDao<Contact> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'contacts');
  }
}
