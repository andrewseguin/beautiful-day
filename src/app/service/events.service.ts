import {Injectable} from "@angular/core";
import {AngularFireDatabase, FirebaseObjectObservable} from "angularfire2";
import {Event} from "../model/event";
import {Observable} from "rxjs";

@Injectable()
export class EventsService {

  constructor(private db: AngularFireDatabase) { }

  getEvents(): Observable<Event[]> {
    return this.db.list('events').map(events => {
      return events.sort((eventA: Event, eventB: Event) => {
        const dateA = new Date(eventA.date);
        const dateB = new Date(eventB.date);
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  getEvent(id: string): FirebaseObjectObservable<Event> {
    return this.db.object(`events/${id}`);
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
