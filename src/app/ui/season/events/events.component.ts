import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EventsDao} from 'app/ui/season/dao';
import {map} from 'rxjs/operators';

@Component({
  selector: 'events-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  sortedEvents = this.eventsDao.list.pipe(
    map(events => {
      if (events) {
        return events.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          return aDate < bDate ? -1 : 1;
        });
      }
    }));

  constructor(public eventsDao: EventsDao) { }
}
