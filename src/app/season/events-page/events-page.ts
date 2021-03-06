import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EventsDao} from 'app/season/dao';
import {map} from 'rxjs/operators';
import {Event} from 'app/season/dao';

@Component({
  templateUrl: 'events-page.html',
  styleUrls: ['events-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPage {
  private sortEvents = map((events: Event[]) => {
    if (events) {
      return events.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate < bDate ? -1 : 1;
      });
    }
  });

  // Tomorrow's date
  cutoff = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));

  pastEvents = this.eventsDao.list.pipe(map(events => {
    if (!events) {
      return null;
    }
    return events.filter(event => new Date(event.date) < this.cutoff);
  }), this.sortEvents);

  upcomingEvents = this.eventsDao.list.pipe(map(events => {
    if (!events) {
      return null;
    }
    return events.filter(event => new Date(event.date) >= this.cutoff);
  }), this.sortEvents);

  trackById = (i, event) => event.id;

  constructor(public eventsDao: EventsDao) { }
}
