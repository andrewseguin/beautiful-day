import {Component} from '@angular/core';
import {Event, EventsDao} from 'app/ui/season/dao';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html'
})
export class Events {
  trackByFn = (i, event: Event) => event.id;

  constructor(private formBuilder: FormBuilder,
              private eventsDao: EventsDao) { }

  addEvent() {
    this.eventsDao.add({});
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
