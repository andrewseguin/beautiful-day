import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FaqsDao, Faq} from 'app/season/dao';
import {sortByDateCreated} from 'app/utility/dao-sort-by';

@Component({
  selector: 'faqs',
  styleUrls: ['faqs.scss'],
  templateUrl: 'faqs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Faqs {
  faqs = this.faqsDao.list.pipe(sortByDateCreated);
  trackByFn = (i, faq: Faq) => faq.id;

  constructor(public faqsDao: FaqsDao) { }

  delete(id: string) {
    this.faqsDao.remove(id);
  }
}
