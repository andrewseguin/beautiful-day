import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MessagesDao, Message} from 'app/season/dao';
import {EXPANSION_ANIMATION} from 'app/utility/animations';

@Component({
  selector: 'editable-message',
  styleUrls: ['editable-message.scss'],
  templateUrl: 'editable-message.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: EXPANSION_ANIMATION
})
export class EditableMessage {
  expandViewedBy = false;
  expandDismissedBy = false;

  bgColors = ['red', 'yellow', 'green'];

  sortedViewedBy = [];
  sortedDismissedBy = [];

  @Input()
  set message(message: Message) {
    this._message = message;
    this.form.get('text').setValue(message.text || '', {emitEvent: false});
    this.form.get('enabled').setValue(message.enabled, {emitEvent: false});
    this.form.get('bgColor').setValue(message.bgColor || this.bgColors[0], {emitEvent: false});

    this.sortedViewedBy =
        this.message.viewedBy ? this.message.viewedBy.sort() : [];
    this.sortedDismissedBy =
        this.message.dismissedBy ? this.message.dismissedBy.sort() : [];
  }
  get message(): Message { return this._message; }
  private _message: Message;

  form = new FormGroup({
    text: new FormControl(''),
    enabled: new FormControl(true),
    bgColor: new FormControl(this.bgColors[0]),
  });

  constructor(public messagesDao: MessagesDao) {
    this.form.valueChanges.subscribe(() => this.update());
  }

  update() {
    const update: Message = {
      text: this.form.value.text,
      enabled: this.form.value.enabled,
      bgColor: this.form.value.bgColor,
    };

    this.messagesDao.update(this.message.id, update);
  }

  delete() {
    this.messagesDao.remove(this.message.id);
  }
}
