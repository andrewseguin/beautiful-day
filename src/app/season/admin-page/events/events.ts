import {Component} from '@angular/core';
import {Event, EventsDao} from 'app/season/dao';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html'
})
export class Events {
  trackByFn = (i, event: Event) => event.id;

  constructor(public eventsDao: EventsDao) { }

  addEvent() {
    this.eventsDao.add({});
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
