import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ItemsDao, RequestsDao, Item, Request} from 'app/season/dao';
import {Subject, combineLatest} from 'rxjs';
import {RequestRendererOptions} from '../services/requests-renderer/request-renderer-options';

@Component({
  selector: 'allocation-page',
  templateUrl: 'allocation-page.html',
  styleUrls: ['allocation-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationPage {
  private _destroyed = new Subject();

  constructor (private itemsDao: ItemsDao,
               private requestsDao: RequestsDao) {
    combineLatest(itemsDao.list, requestsDao.list)
        .subscribe(result => {
          const items = result[0] as Item[];
          const requests = result[1] as Request[];

          if (!items || !requests) {
            return;
          }

          // Determine the requests with stocked items and render them for allocation
        })
               }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
