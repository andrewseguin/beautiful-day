import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PermissionsService} from 'app/service/permissions.service';
import {EventDialog} from 'app/ui/pages/shared/dialog/event.dialog';
import {EventsDao} from 'app/service/dao';
import {map} from 'rxjs/operators';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'events-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent {
  sortedEvents = this.eventsDao.list.pipe(
    map(events => {
      if (!events) {
        return;
      }

      return events.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate < bDate ? -1 : 1;
      });
    }));
  canEditEvents = this.permissionsService.canEditEvents();

  isLoading = true;

  constructor(public eventDialog: EventDialog,
              private permissionsService: PermissionsService,
              private cd: ChangeDetectorRef,
              private eventsDao: EventsDao) {
    combineLatest([this.sortedEvents, this.canEditEvents])
        .subscribe(() => {
          this.isLoading = false;
          this.cd.markForCheck();
        });
  }
}
