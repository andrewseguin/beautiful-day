import {Component} from '@angular/core';
import {EventsDao} from 'app/service/dao/events-dao';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html'
})
export class Events {
  test = new FormControl('');

  constructor(private eventsDao: EventsDao) {
    this.eventsDao.list.subscribe(events => {
      console.log(events);
    });

    this.test.valueChanges.subscribe(console.log)
  }
}
