import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Project} from 'app/model';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class ProjectsDao extends SeasonCollectionDao<Project> {
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, activatedSeason: ActivatedSeason) {
    super(afs, afAuth, activatedSeason, 'projects');
  }
}
