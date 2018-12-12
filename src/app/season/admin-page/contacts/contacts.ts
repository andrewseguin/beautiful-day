import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Contact, ContactsDao} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';

@Component({
  selector: 'contacts',
  styleUrls: ['contacts.scss'],
  templateUrl: 'contacts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contacts {
  contacts = this.contactsDao.list.pipe(sortByDateCreated);
  trackByFn = (i, contact: Contact) => contact.id;

  constructor(public contactsDao: ContactsDao) { }

  delete(id: string) {
    this.contactsDao.remove(id);
  }
}
