import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class ActivatedSeason {
  season = new BehaviorSubject<string|null>(null);
}
