import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventsDao, Event} from 'app/season/dao';

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
    const formValues = this.form.value;

    const update: Event = {
      date: new Date(formValues.date).toISOString(),
      info: formValues.info,
      time: formValues.time
    };

    if (!update.date || !update.info) {
      return;
    }

    this.eventsDao.update(this.event.id, update);
  }

  delete() {
    this.eventsDao.remove(this.event.id);
  }
}
