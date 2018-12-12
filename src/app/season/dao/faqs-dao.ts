import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Faq {
  id?: string;
  question?: string;
  answer?: string;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class FaqsDao extends SeasonCollectionDao<Faq> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'faqs');
  }
}
