import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Event, EventsDao} from 'app/season/dao';
import {focusElement, highlight, scroll, SCROLL_ANIMATION_TIME} from 'app/utility/element-actions';
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

  addEvent() {
    this.eventsDao.add({}).then(id => {
      highlight(id);
      scroll(id);
      setTimeout(() => focusElement(id, 'input'), SCROLL_ANIMATION_TIME);
    });
  }

  delete(id: string) {
    this.eventsDao.remove(id);
  }
}
