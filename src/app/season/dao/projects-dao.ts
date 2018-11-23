import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from 'app/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

export interface Project {
  id?: string;
  location?: string;
  name?: string;
  season?: string;
  budget?: number;
  description?: string;
  leads?: string[];
  directors?: string[];
  acquisitions?: string[];
  receiptsFolder?: string;
  whitelist?: string[];
  defaultDropoffLocation?: string;
  defaultDropoffDate?: string;
  dateCreated?: string;
  dateModified?: string;
}

@Injectable()
export class ProjectsDao extends SeasonCollectionDao<Project> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'projects');
  }
}
