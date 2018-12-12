import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EventsDao, Event} from 'app/season/dao';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

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

  private _destroyed = new Subject();

  constructor(public eventsDao: EventsDao) {
    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this._destroyed))
      .subscribe(() => this.update());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  update() {
    const formValues = this.form.value;

    if (!formValues.date || !formValues.info) {
      return;
    }

    const update: Event = {
      date: new Date(formValues.date).toISOString(),
      info: formValues.info,
      time: formValues.time || ''
    };

    this.eventsDao.update(this.event.id, update);
  }

  delete() {
    this.eventsDao.remove(this.event.id);
  }
}
