import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Message, MessagesDao} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';

@Component({
  selector: 'messages',
  styleUrls: ['messages.scss'],
  templateUrl: 'messages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Messages {
  messages = this.messagesDao.list.pipe(sortByDateCreated);

  trackByFn = (i, message: Message) => message.id;

  constructor(public messagesDao: MessagesDao) { }

  delete(id: string) {
    this.messagesDao.remove(id);
  }
}
