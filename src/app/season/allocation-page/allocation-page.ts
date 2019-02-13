import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Item, ItemsDao, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {combineLatest, Subject} from 'rxjs';

interface StockedRequest {
  request: Request;
  name: string;
}

interface StockedItemRequests {
  item: Item;
  requests: StockedRequest[];
}

@Component({
  selector: 'allocation-page',
  templateUrl: 'allocation-page.html',
  styleUrls: ['allocation-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationPage {
  stockedItemRequestsList: StockedItemRequests[] = [];
  private _destroyed = new Subject();
  private projects: Map<string, Project>;

  constructor(
      itemsDao: ItemsDao, requestsDao: RequestsDao, projectsDao: ProjectsDao,
      cd: ChangeDetectorRef) {
    combineLatest(itemsDao.list, requestsDao.list, projectsDao.map)
        .subscribe(result => {
          const items = result[0];
          const requests = result[1];
          this.projects = result[2];

          if (!items || !requests || !this.projects) {
            return;
          }

          this.stockedItemRequestsList =
              this.getStockedItemRequestsList(result[0] || [], result[1] || []);
          cd.markForCheck();
        });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  getStockedItemRequestsList(items: Item[], requests: Request[]):
      StockedItemRequests[] {
    const stockedItems = this.getStockedItems(items);

    const stockedItemRequestsMap = new Map<string, StockedItemRequests>();
    requests.forEach(request => {
      const item = stockedItems.get(request.item);
      if (!item) {
        return;
      }

      if (!stockedItemRequestsMap.get(request.item)) {
        stockedItemRequestsMap.set(request.item, {item, requests: []});
      }

      stockedItemRequestsMap.get(request.item).requests.push({
        request,
        name: this.projects.get(request.project).name});
    });

    const stockedItemRequestsList = [];
    stockedItemRequestsMap.forEach(value => {
      stockedItemRequestsList.push(value);
    });

    return stockedItemRequestsList;
  }

  getStockedItems(items): Map<string, Item> {
    const itemsWithStock = new Map<string, Item>();
    items.forEach(item => {
      if (item.quantityOwned) {
        itemsWithStock.set(item.id, item);
      }
    });

    return itemsWithStock;
  }
}
