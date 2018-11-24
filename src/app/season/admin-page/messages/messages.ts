import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MessagesDao, Message} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';
import {highlight, focusElement, scroll, SCROLL_ANIMATION_TIME} from 'app/utility/element-actions';

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

  add() {
    const newMessage: Message = {
      text: 'New message',
      bgColor: 'red',
      enabled: true,
    };
    this.messagesDao.add(newMessage).then(id => {
      scroll(id);
      highlight(id);
      setTimeout(() => focusElement(id, 'textarea'), SCROLL_ANIMATION_TIME);
    });
  }

  delete(id: string) {
    this.messagesDao.remove(id);
  }
}
