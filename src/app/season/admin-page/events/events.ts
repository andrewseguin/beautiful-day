import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Event, EventsDao} from 'app/season/dao';
import {map} from 'rxjs/operators';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Events {
  events = this.eventsDao.list.pipe(map(events => {
    return events ? events.sort((a, b) => a.id > b.id ? -1 : 1) : null;
  }));

  trackByFn = (i, event: Event) => event.id;

  constructor(public eventsDao: EventsDao) { }

  addEvent() {
    this.eventsDao.add({});
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
