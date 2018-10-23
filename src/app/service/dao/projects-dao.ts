import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Project} from 'app/model';
import {ListDao} from 'app/service/dao/list-dao';

@Injectable()
export class ProjectsDao extends ListDao<Project> {
  constructor(afs: AngularFirestore) {
    super(afs, 'projects');
  }
}
