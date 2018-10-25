import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event} from 'app/model';
import {FormControl, FormGroup} from '@angular/forms';
import {EventsDao} from 'app/ui/season/dao';

@Component({
  selector: 'editable-event',
  styleUrls: ['editable-event.scss'],
  templateUrl: 'editable-event.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableEvent {
  @Input()
  set event(event: Event) {
    this._event = event;
    this.form.get('date').setValue(event.date, {emitEvent: false});
    this.form.get('time').setValue(event.time, {emitEvent: false});
    this.form.get('info').setValue(event.info, {emitEvent: false});
  }
  get event(): Event { return this._event; }
  private _event: Event;

  form = new FormGroup({
    date: new FormControl(''),
    time: new FormControl(''),
    info: new FormControl(''),
  });

  constructor(private eventsDao: EventsDao) {
    this.form.valueChanges.subscribe(() => this.update());
  }

  update() {
    const update: Event = {
      date: new Date(this.form.get('date').value).toISOString(),
      info: this.form.get('info').value,
    };

    if (!update.date || !update.info) {
      return;
    }

    const time = this.form.get('time').value;
    if (time) {
      update.time = time;
    }

    this.eventsDao.update(this.event.id, update);
  }

  delete() {
    this.eventsDao.remove(this.event.id);
  }
}
