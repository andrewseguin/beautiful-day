import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EventsDao} from 'app/ui/season/dao';
import {map} from 'rxjs/operators';
import {Event} from 'app/model';
import {Observable} from 'rxjs';

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

  private pastEvents = this.eventsDao.list.pipe(map(events => {
    if (!events) {
      return null;
    }
    return events.filter(event => new Date(event.date) < new Date('March 28 2018'));
  }), this.sortEvents);

  private upcomingEvents = this.eventsDao.list.pipe(map(events => {
    if (!events) {
      return null;
    }
    return events.filter(event => new Date(event.date) >= new Date('March 28 2018'));
  }), this.sortEvents);

  trackById = (i, event) => event.id;
  trackByLabel = (i, groupedEvent) => groupedEvent.label;
  groupedEvents: {label: string, events: Observable<Event[]>}[] = [
    {label: 'Upcoming Events', events: this.upcomingEvents},
    {label: 'Past Events', events: this.pastEvents},
  ];

  constructor(public eventsDao: EventsDao) { }
}
