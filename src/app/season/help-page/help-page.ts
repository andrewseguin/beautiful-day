import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FaqsDao} from 'app/season/dao';

interface Contact {
  name: string;
  title: string;
  email: string;
}

@Component({
  styleUrls: ['help-page.scss'],
  templateUrl: 'help-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPage {
  contacts: Contact[] = [
    {name: 'Finny Abraham', title: 'Executive Directive', email: 'finny@beautifulday.com'},
    {name: 'Jen Laity', title: 'Acquisitions Director', email: 'jen@beautifulday.com'},
    {name: 'Andrew Seguin', title: 'Site Developer', email: 'andrew@beautifulday.com'},
  ];

  constructor(public faqsDao: FaqsDao) { }
}
