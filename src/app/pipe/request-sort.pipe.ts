import { Pipe, PipeTransform } from '@angular/core';
import {Sort} from "../ui/pages/project/requests/requests-group/requests-group.component";
import {Request} from "../model/request";
import {ItemsService} from "../service/items.service";
import {Item} from "../model/item";
import {Observable, Subject} from "rxjs";

@Pipe({name: 'requestSort'})
export class RequestSortPipe implements PipeTransform {
  items: Item[];

  constructor(private itemsService: ItemsService) {}

  transform(requests: Request[], sort: Sort): Observable<Request[]> {
    const response = new Subject<Request[]>();
    this.itemsService.getItems().subscribe(items => {
      response.next(requests.sort(this.getSortFunction(sort, items)));
    });

    return response.asObservable();
  }

  getSortFunction(sort: Sort, items: Item[]) {
    const itemMap = new Map<string, Item>();
    items.forEach(item => itemMap.set(item.$key, item));

    switch(sort) {
      case 'request added':
        return (a: Request, b: Request) => {
          return a.$key > b.$key ? -1 : 1;
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
