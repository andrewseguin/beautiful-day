import { Component, OnInit } from '@angular/core';
import {TitleService} from 'app/service/header.service';
import {EventsService} from 'app/service/events.service';
import {Event} from 'app/model/event';
import {EditEventComponent} from 'app/ui/pages/shared/dialog/edit-event/edit-event.component';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'events-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  sortedEvents = this.eventsService.getSortedEvents();
  canEditEvents = this.permissionsService.canEditEvents();

  constructor(private mdDialog: MatDialog,
              private permissionsService: PermissionsService,
              private eventsService: EventsService) { }

  addEvent() {
    this.mdDialog.open(EditEventComponent);
  }

  editEvent(event: Event) {
    const dialogRef = this.mdDialog.open(EditEventComponent);
    dialogRef.componentInstance.event = event;
  }
}
