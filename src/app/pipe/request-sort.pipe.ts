import {Pipe, PipeTransform} from "@angular/core";
import {Sort} from "../ui/pages/project/requests/requests-group/requests-group.component";
import {Request} from "../model/request";
import {Item} from "../model/item";

@Pipe({name: 'requestSort'})
export class RequestSortPipe implements PipeTransform {

  transform(requests: Request[], sort: Sort, items: Item[]): Request[] {
    return requests.sort(this.getSortFunction(sort, items));
  }

  getSortFunction(sort: Sort, items: Item[]) {
    const itemMap = new Map<string, Item>();
    items.forEach(item => itemMap.set(item.$key, item));

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

}
