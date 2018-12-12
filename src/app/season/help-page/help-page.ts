import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ContactsDao, FaqsDao} from 'app/season/dao';

@Component({
  styleUrls: ['help-page.scss'],
  templateUrl: 'help-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPage {
  constructor(public faqsDao: FaqsDao, public contactsDao: ContactsDao) { }
}
