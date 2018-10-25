import {ListDao} from 'app/utility/list-dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from '../services';

export class SeasonCollectionDao<T> extends ListDao<T> {
  constructor(afs: AngularFirestore, activatedSeason: ActivatedSeason, subPath: string) {
    super(afs);

    activatedSeason.season.subscribe(season => {
      if (season) {
        this.path = `seasons/${season}/${subPath}`;
      }
    });
  }
}
