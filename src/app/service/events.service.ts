import {Injectable, OnDestroy} from '@angular/core';
import {Event} from '../model/event';
import {Observable} from 'rxjs/Observable';
import {AngularFireDatabase, } from '@angular/fire/database';
import {DaoService} from './dao-service';
import {map, takeUntil} from 'rxjs/operators';
import {BehaviorSubject, Subject} from 'rxjs';


@Injectable()
export class EventsService extends DaoService<Event> implements OnDestroy {
  events = new BehaviorSubject<Event[]>([]);

  private destroyed = new Subject();

  constructor(db: AngularFireDatabase) {
    super(db, 'events');

    this.getKeyedListDao().pipe(
        takeUntil(this.destroyed))
        .subscribe(events => {
          this.events.next(events);
        });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getSortedEvents(): Observable<Event[]> {
    const sortFn = (a: Event, b: Event) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    };

    return this.events.pipe(map(events => events.sort(sortFn)));
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.getSortedEvents().pipe(map(events => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      let upcomingEvents = events.filter(event => {
        return yesterday < new Date(event.date);
      });

      return upcomingEvents.slice(0, 3);
    }));
  }
}
