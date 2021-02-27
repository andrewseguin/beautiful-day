import {IdentifiedObject, ListDao} from 'app/utility/list-dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from '../services';
import {filter, map} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

export class SeasonCollectionDao<T extends IdentifiedObject> extends ListDao<T> {
  constructor(afs: AngularFirestore,
              afAuth: AngularFireAuth,
              activatedSeason: ActivatedSeason,
              subPath: string) {
    const path = activatedSeason.season.pipe(filter(season => !!season), map(season => `seasons/${season}/${subPath}`));
    super(afs, afAuth, path);

  }
}
