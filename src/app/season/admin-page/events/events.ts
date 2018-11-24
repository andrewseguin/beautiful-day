import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Event, EventsDao} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';

@Component({
  selector: 'events',
  styleUrls: ['events.scss'],
  templateUrl: 'events.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Events {
  events = this.eventsDao.list.pipe(sortByDateCreated);
  trackByFn = (i, event: Event) => event.id;

  constructor(public eventsDao: EventsDao) { }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
