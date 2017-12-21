import { Component, OnInit } from '@angular/core';
import {HeaderService} from 'app/service/header.service';
import {EventsService} from 'app/service/events.service';
import {Event} from 'app/model/event';
import {EditEventComponent} from 'app/ui/shared/dialog/edit-event/edit-event.component';
import {MatDialog} from '@angular/material';
import {PermissionsService} from 'app/service/permissions.service';

@Component({
  selector: 'events-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  title = 'Events';
  events: Event[];
  canEditEvents = false;

  constructor(private mdDialog: MatDialog,
              private permissionsService: PermissionsService,
              private headerService: HeaderService,
              private eventsService: EventsService) { }

  ngOnInit() {
    this.headerService.title = this.title;
    this.eventsService.getSortedEvents()
        .subscribe(events => this.events = events);
    this.permissionsService.canEditEvents()
        .subscribe(canEditEvents => this.canEditEvents = canEditEvents);
  }

  addEvent() {
    this.mdDialog.open(EditEventComponent);
  }

  editEvent(event: Event) {
    const dialogRef = this.mdDialog.open(EditEventComponent);
    dialogRef.componentInstance.event = event;
  }
}
