import {ListDao} from 'app/utility/list-dao';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedSeason} from '../services';
import {takeUntil} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

export class SeasonCollectionDao<T> extends ListDao<T> {
  constructor(afs: AngularFirestore,
              afAuth: AngularFireAuth,
              activatedSeason: ActivatedSeason,
              subPath: string) {
    super(afs, afAuth);

    activatedSeason.season.pipe(takeUntil(this.destroyed))
        .subscribe(season => {
          if (season) {
            this.path = `seasons/${season}/${subPath}`;
          }
        });
  }
}
