import {Component} from '@angular/core';
import {EventsDao} from 'app/ui/season/dao/events-dao';
import {FormBuilder} from '@angular/forms';
import {Event} from 'app/model';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html'
})
export class Events {
  trackBy = (i, event: Event) => event.id;

  constructor(private formBuilder: FormBuilder,
              private eventsDao: EventsDao) { }

  addEvent() {
    this.eventsDao.add({});
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
