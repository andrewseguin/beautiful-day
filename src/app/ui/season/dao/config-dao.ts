import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActivatedSeason} from 'app/ui/season/services/activated-season';

export interface Config {
  id?: string;
  value?: any;
}

@Injectable()
export class ConfigDao {
  get values(): BehaviorSubject<Map<string, any>|null> {
    if (!this._values) {
      this._values = new BehaviorSubject<Map<string, any>>(null);
      console.log('Loading config');
      this.collection.valueChanges().subscribe(configs => {
        const updatedValues = new Map<string, any>();
        configs.forEach(config => {
          updatedValues.set(config.id, config.value);
        });
        this._values.next(updatedValues);
      });
    }
    return this._values;
  }
  _values: BehaviorSubject<Map<string, any>|null>;

  protected collection: AngularFirestoreCollection<Config>;

  constructor(private afs: AngularFirestore, activatedSeason: ActivatedSeason) {
    this.collection = this.afs.collection<Config>('config');
  }

  update(id: string, value: any) {
    this.collection.doc(id).update({value});
  }
}

