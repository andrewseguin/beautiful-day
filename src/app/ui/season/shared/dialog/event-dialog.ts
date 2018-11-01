import {Injectable} from '@angular/core';
import {take} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {Event} from 'app/model';
import {ReportDelete} from 'app/ui/season/shared/dialog/report-delete/report-delete';
import {EventsDao} from 'app/ui/season/dao/events-dao';
import {EventEdit} from 'app/ui/season/shared/dialog/event-edit/event-edit';

@Injectable()
export class EventDialog {
  constructor(private dialog: MatDialog,
              private router: Router,
              private eventsDao: EventsDao) {}

  /** Shows the edit event dialog to change the event details. */
  editEvent(event: Event) {
    this.dialog.open(EventEdit, {data: event}).afterClosed().pipe(
        take(1))
        .subscribe(result => {
          if (result) {
            this.eventsDao.update(event.id, result);
          }
        });
  }

  /** Shows delete event dialog. If user confirms deletion, remove the event. */
  deleteEvent(event: Event) {
    const data = {name: event.info};
    this.dialog.open(ReportDelete, {data}).afterClosed().pipe(
        take(1))
        .subscribe(confirmed => {
          if (confirmed) {
            this.eventsDao.remove(event.id);
          }
        });
  }

  /** Shows edit event dialog to enter the date, info, and optionally a time. */
  createEvent() {
    this.dialog.open(EventEdit, {data: {}}).afterClosed().pipe(
        take(1))
        .subscribe(result => {
          if (result) {
            this.eventsDao.add(result);
          }
        });
  }
}
