import { Injectable } from '@angular/core';
import {
  Item,
  ItemsDao,
  Project,
  ProjectsDao,
  Request,
  RequestsDao,
} from '../dao';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable()
export class Allocations {
  itemAllocations = combineLatest([
    this.itemsDao.list,
    this.requestsDao.list,
    this.projectsDao.map,
  ]).pipe(
    map(([items, requests, projects]) => {
      return this.getAllocations(items, requests, projects);
    }),
  );

  constructor(
    private itemsDao: ItemsDao,
    private requestsDao: RequestsDao,
    private projectsDao: ProjectsDao,
  ) {}

  getAllocations(
    items: Item[],
    requests: Request[],
    projects: Map<string, Project>,
  ): Map<string, ItemAllocations> {
    const stockedItems = this.getStockedItems(items);
    const map = new Map<string, ItemAllocations>();

    items.forEach((item) => {
      if (!map.get(item.id)) {
        map.set(item.id, {
          id: item.id,
          itemName: item.categories.join(' > ') + ' > ' + item.name,
          quantityOwned: item.quantityOwned,
          remaining: item.quantityOwned,
          requestAllocations: [],
        });
      }
    });

    requests.forEach((request) => {
      const item = stockedItems.get(request.item);
      if (!item) {
        return [];
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

    return map;
  }

  getStockedItems(items): Map<string, Item> {
    const itemsWithStock = new Map<string, Item>();
    items.forEach((item) => {
      if (item.quantityOwned) {
        itemsWithStock.set(item.id, item);
      }
    });

    return itemsWithStock;
  }
}
