import {Component} from '@angular/core';
import {EventsDao} from 'app/service/dao/events-dao';
import {FormBuilder} from '@angular/forms';
import {Event} from 'app/model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html'
})
export class Events {
  trackBy = (i, event: Event) => event.id;
  events = this.eventsDao.list.pipe(map(events => {
    if (events) {
      return events.sort((a, b) => !a.date || a.date > b.date ? -1 : 1);
    }
  }));

  constructor(private formBuilder: FormBuilder,
              private eventsDao: EventsDao) { }

  addEvent() {
    this.eventsDao.add({});
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
