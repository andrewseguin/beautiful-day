import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MessagesDao, Message} from 'app/season/dao';
import {map} from 'rxjs/operators';

@Component({
  selector: 'messages',
  styleUrls: ['messages.scss'],
  templateUrl: 'messages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Messages {
  messages = this.messagesDao.list.pipe(map(messages => {
    return messages ? messages.sort((a, b) => a.creationTime > b.creationTime ? -1 : 1) : null;
  }));

  trackByFn = (i, message: Message) => message.id;

  constructor(public messagesDao: MessagesDao) { }

  add() {
    this.messagesDao.add({bgColor: 'red'});
  }

  delete(id: string) {
    this.messagesDao.remove(id);
  }
}
