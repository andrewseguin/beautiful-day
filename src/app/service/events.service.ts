import {Injectable} from '@angular/core';
import {Event} from '../model/event';
import {Observable} from 'rxjs';
import {AngularFireDatabase, AngularFireObject, } from 'angularfire2/database';
import {transformSnapshotActionList} from '../utility/snapshot-tranform';


@Injectable()
export class EventsService {
  events: Observable<Event[]>;

  constructor(private db: AngularFireDatabase) {
    this.events = this.db.list<Event>('events').snapshotChanges().map(transformSnapshotActionList);
  }

  getSortedEvents(): Observable<Event[]> {
    return this.events.map(events => {
      return events.sort((eventA: Event, eventB: Event) => {
        const dateA = new Date(eventA.date);
        const dateB = new Date(eventB.date);
        return dateA.getTime() - dateB.getTime();
      });
    });
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

  getEvent(id: string): AngularFireObject<Event> {
    return this.db.object<Event>(`events/${id}`);
  }

  add(event: Event) {
    this.db.list('events').push(event);
  }

  remove(event: Event) {
    this.getEvent(event.$key).remove();
  }

  update(id: string, update: Event) {
    this.getEvent(id).update(update);
  }
}
