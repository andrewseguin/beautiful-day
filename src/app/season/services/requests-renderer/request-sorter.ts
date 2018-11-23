import {Item, Request} from 'app/season/dao';
import {Sort} from 'app/season/services/requests-renderer/request-renderer-options';
import {getItemName} from 'app/season/utility/item-name';

export class RequestSorter {
  getSortFunction(sort: Sort, itemMap: Map<string, Item>) {
    switch (sort) {
      case 'requestAdded':
        return (a: Request, b: Request) => {
          return a.dateCreated > b.dateCreated ? -1 : 1;
        };
      case 'requestCost':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);

          const costA = a.quantity * (itemA.cost || 0);
          const costB = b.quantity * (itemB.cost || 0);
          return costA > costB ? -1 : 1;
        };
      case 'itemCost':
        return (a: Request, b: Request) => {
          const costA = itemMap.get(a.item).cost || 0;
          const costB = itemMap.get(b.item).cost || 0;
          return costA > costB ? -1 : 1;
        };
      case 'itemName':
        return (a: Request, b: Request) => {
          const nameA = getItemName(itemMap.get(a.item));
          const nameB = getItemName(itemMap.get(b.item));
          return nameA < nameB ? -1 : 1;
        };
      case 'dropoffDate':
        return (a: Request, b: Request) => {
          return a.date < b.date ? -1 : 1;
        };
    }
  }
}
