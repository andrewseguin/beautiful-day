import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Project} from 'app/model';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';
import {SeasonCollectionDao} from './season-collection-dao';

@Injectable()
export class ProjectsDao extends SeasonCollectionDao<Project> {
  constructor(afs: AngularFirestore, activatedSeason: ActivatedSeason) {
    super(afs, activatedSeason, 'projects');
  }
}
