import {Pipe, PipeTransform} from "@angular/core";
import {Sort} from "../ui/pages/project/requests/requests-group/requests-group.component";
import {Request} from "../model/request";
import {Item} from "../model/item";

@Pipe({name: 'requestSort'})
export class RequestSortPipe implements PipeTransform {

  transform(requests: Request[], sort: Sort, filter: string, items: Item[]): Request[] {
    const itemMap = new Map<string, Item>();
    items.forEach(item => itemMap.set(item.$key, item));

    const filterTokens = filter.split(' ');
    const filteredRequests = requests.filter(request => {
      const item = itemMap.get(request.item);
      return filterTokens.every(token => this.requestMatchesSearch(request, item, token));
    });

    return filteredRequests.sort(this.getSortFunction(sort, itemMap));
  }

  getSortFunction(sort: Sort, itemMap: Map<string, Item>) {
    switch(sort) {
      case 'request added':
        return (a: Request, b: Request) => {
          return a.$key < b.$key ? -1 : 1;
        };
      case 'cost':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);

          const costA = a.quantity * itemA.cost;
          const costB = b.quantity * itemB.cost;
          return costA < costB ? -1 : 1;
        };
      case 'item':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);
          return itemA.name < itemB.name ? -1 : 1;
        };
    }
  }


  requestMatchesSearch(request: Request, item: Item, token: string) {
    const requestStr = (request.dropoff + request.note + request.quantity + request.tags).toLowerCase();
    const itemStr = (item.name + item.type + item.categories + item.url).toLowerCase();
    return requestStr.indexOf(token.toLowerCase()) != -1 ||
        itemStr.indexOf(token.toLowerCase()) != -1;
  }
}
