import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Event} from 'app/model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventsDao} from 'app/service/dao';

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
    date: new FormControl('', Validators.required),
    time: new FormControl(''),
    info: new FormControl('', Validators.required),
  });

  constructor(private eventsDao: EventsDao) {
    this.form.valueChanges.subscribe(() => this.update());
  }

  update() {
    if (!this.form.valid) {
      return;
    }

    const update: Event = {
      date: this.form.get('date').value,
      info: this.form.get('info').value,
    };

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
