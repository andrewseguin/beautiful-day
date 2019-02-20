import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Item, ItemsDao, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {combineLatest, Subject} from 'rxjs';

interface RequestAllocation {
  id: string;
  allocation: number;
  project: string;
  requested: number;
}

interface ItemAllocations {
  id: string;
  itemName: string;
  quantityOwned: number;
  remaining: number;
  requestAllocations: RequestAllocation[];
}

@Component({
  selector: 'allocation-page',
  templateUrl: 'allocation-page.html',
  styleUrls: ['allocation-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllocationPage {
  itemAllocationsList: ItemAllocations[] = [];
  private _destroyed = new Subject();

  trackByItemAllocations = (_i: number, o: ItemAllocations) => o.id;
  trackByRequestAllocation = (_i: number, o: RequestAllocation) => o.id;

  constructor(
      itemsDao: ItemsDao, requestsDao: RequestsDao, projectsDao: ProjectsDao,
      cd: ChangeDetectorRef) {
    const changes = [itemsDao.list, requestsDao.list, projectsDao.map];
    combineLatest(...changes).subscribe(result => {
      const items = result[0];
      const requests = result[1];
      const projects = result[2];

      if (!items || !requests || !projects) {
        return;
      }

      this.itemAllocationsList = this.getAllocations(items, requests, projects);
      cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  getAllocations(
      items: Item[], requests: Request[],
      projects: Map<string, Project>): ItemAllocations[] {
    const stockedItems = this.getStockedItems(items);
    const map = new Map<string, ItemAllocations>();

    requests.forEach(request => {
      const item = stockedItems.get(request.item);
      if (!item) {
        return;
      }

      if (!map.get(request.item)) {
        map.set(request.item, {
          id: item.id,
          itemName: item.categories.join(' > ') + ' > ' + item.name,
          quantityOwned: item.quantityOwned,
          remaining: item.quantityOwned,
          requestAllocations: []
        });
      }

      const itemAllocations = map.get(request.item);
      itemAllocations.remaining =
          itemAllocations.remaining - (request.allocation || 0);
      map.get(request.item).requestAllocations.push({
        id: request.id,
        allocation: request.allocation,
        project: projects.get(request.project).name,
        requested: request.quantity,
      });
    });

    const list: ItemAllocations[] = [];
    map.forEach(value => list.push(value));
    list.sort((a, b) => a.itemName < b.itemName ? -1 : 1);
    return list;
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
