import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";
import {Event} from '../../../../model/event';
import {EventsService} from "../../../../service/events.service";

@Component({
  selector: 'edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent {
  date: string;
  time: string;
  info: string;

  _event: Event;
  set event(event: Event) {
    this._event = event;
    this.date = this.getDateFromEvent(this.event.date);
    this.time = this.event.time;
    this.info = this.event.info;
  }
  get event(): Event { return this._event; }

  constructor(private dialogRef: MdDialogRef<EditEventComponent>,
              private eventsService: EventsService) {}

  remove() {
    this.eventsService.remove(this.event);
    this.close();
  }

  close() {
    this.dialogRef.close();
  }

  canSave() {
    return this.date && this.info;
  }

  getDateFromEvent(eventDate: number) {
    const date = new Date(eventDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear()+"-"+(month)+"-"+(day) ;
  }

  save() {
    if (!this.canSave()) { return; }

    // Move the UTC date to user's time zone
    const adjustedDate = new Date(this.date);
    adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());

    const event: Event = {
      date: adjustedDate.getTime(),
      time: this.time || '',
      info: this.info
    };

    this.event ? this.eventsService.update(this.event.$key, event) : this.eventsService.add(event);
    this.close();
  }
}
