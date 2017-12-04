import {Injectable} from '@angular/core';
import {Event} from '../model/event';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase,} from 'angularfire2/database';
import {DaoService} from './dao-service';


@Injectable()
export class EventsService extends DaoService<Event> {
  events: Observable<Event[]>;

  constructor(db: AngularFireDatabase) {
    super(db, 'events');
    this.events = this.getKeyedListDao();
  }

  getSortedEvents(): Observable<Event[]> {
    const sortFn = (a: Event, b: Event) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    };

    return this.events.map(events => events.sort(sortFn));
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.getSortedEvents().map(events => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      let upcomingEvents = events.filter(event => {
        return yesterday < new Date(event.date);
      });

      return upcomingEvents.slice(0, 3);
    });
  }
}
