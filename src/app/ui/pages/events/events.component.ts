import { Component, OnInit } from '@angular/core';
import {HeaderService} from '../../../service/header.service';
import {EventsService} from '../../../service/events.service';
import {Event} from '../../../model/event';

@Component({
  selector: 'events-page',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events: Event[];
  canEditEvents = true;

  constructor(private headerService: HeaderService,
              private eventsService: EventsService) { }

  ngOnInit() {
    this.headerService.title = 'Important Dates';
    this.eventsService.getEvents().subscribe(events => this.events = events);
  }
}
