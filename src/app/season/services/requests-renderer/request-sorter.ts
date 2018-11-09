import {Item, Request} from 'app/season/dao/index';
import {Sort} from 'app/season/services/requests-renderer/request-renderer-options';
import {getItemName} from 'app/season/utility/item-name';

export class RequestSorter {
  getSortFunction(sort: Sort, itemMap: Map<string, Item>) {
    switch (sort) {
      case 'request added':
        return (a: Request, b: Request) => {
          return a.id > b.id ? -1 : 1;
        };
      case 'request cost':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);

          const costA = a.quantity * (itemA.cost || 0);
          const costB = b.quantity * (itemB.cost || 0);
          return costA > costB ? -1 : 1;
        };
      case 'item cost':
        return (a: Request, b: Request) => {
          const costA = itemMap.get(a.item).cost || 0;
          const costB = itemMap.get(b.item).cost || 0;
          return costA > costB ? -1 : 1;
        };
      case 'item name':
        return (a: Request, b: Request) => {
          const nameA = getItemName(itemMap.get(a.item));
          const nameB = getItemName(itemMap.get(b.item));
          return nameA < nameB ? -1 : 1;
        };
      case 'date needed':
        return (a: Request, b: Request) => {
          return a.date < b.date ? -1 : 1;
        };
      case 'purchaser':
        return (a: Request, b: Request) => {
          if (!a.purchaser) { return 1; }
          if (!b.purchaser) { return -1; }
          if (a.purchaser === b.purchaser) { return 0; }

          return a.purchaser < b.purchaser ? -1 : 1;
        };
    }
  }
}
