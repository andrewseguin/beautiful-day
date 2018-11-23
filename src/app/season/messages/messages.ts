import {Message, MessagesDao} from 'app/season/dao';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {animate, style, transition, trigger} from '@angular/animations';
import {ANIMATION_DURATION} from 'app/utility/animations';
import {AngularFireAuth} from '@angular/fire/auth';
import {combineLatest} from 'rxjs';
import {User} from 'firebase';

@Component({
  selector: 'messages',
  styleUrls: ['messages.scss'],
  templateUrl: 'messages.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expand', [
      transition(':enter', [
        style({ minHeight: 0, height: '0', opacity: 0 }),
        animate(ANIMATION_DURATION, style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate(ANIMATION_DURATION, style({ minHeight: 0, height: '0', opacity: 0 })),
      ]),
    ]),
  ]
})
export class Messages {
  trackBy = (_i, message) => message.id;

  messages = combineLatest([this.messagesDao.list, this.afAuth.authState]).pipe(
      map((result: any) => {
        let messages = result[0] as Message[];
        const email = (result[1] as User).email;

        if (!messages) {
          return [];
        }

        // Filter out empty messages
        messages = messages.filter(msg => msg.text);

        // Filter out messages that this user has dismissed
        messages = messages.filter(msg => (msg.dismissedBy || []).indexOf(email) === -1);

        // Add user to viewedBy list
        messages.forEach(message => this.addUserToList(message, email, 'viewedBy'));

        return messages;
      }));

  constructor(public messagesDao: MessagesDao,
              private afAuth: AngularFireAuth) {}

  dismiss(message: Message) {
    this.afAuth.authState.pipe(take(1)).subscribe(auth => {
      this.addUserToList(message, auth.email, 'dismissedBy');
    });
  }

  private addUserToList(
      message: Message, email: string, listName: 'dismissedBy' | 'viewedBy') {
    if (!message[listName] || message[listName].indexOf(email) === -1) {
      const newList = (message[listName] || []).slice();
      newList.push(email);
      const update = {};
      update[listName] = newList;
      this.messagesDao.update(message.id, update);
    }
  }
}
