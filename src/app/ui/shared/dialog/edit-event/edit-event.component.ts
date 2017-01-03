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
    this.date = this.event.date;
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

  save() {
    if (!this.canSave()) { return; }

    const event = {
      date: this.date,
      time: this.time || '',
      info: this.info
    };

    console.log(event)
    this.event ? this.eventsService.update(this.event.$key, event) : this.eventsService.add(event);
    this.close();
  }
}
