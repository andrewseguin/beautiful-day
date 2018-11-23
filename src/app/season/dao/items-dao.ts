import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Item {
  id?: string;
  name?: string;
  categories?: string[];
  url?: string;
  cost?: number;
  isApproved?: boolean;
  isRental?: boolean;
  createdBy?: string;
  dateAdded?: number;
  keywords?: string;
  quantityOwned?: string;
  hidden?: boolean;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class ItemsDao extends SeasonCollectionDao<Item> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'items');
  }
}
