import {Pipe, PipeTransform} from "@angular/core";
import {Sort} from "../ui/shared/requests-list/requests-group/requests-group.component";
import {Request} from "../model/request";
import {Item} from "../model/item";
import {Project} from "../model/project";
import {RequestSearchTransformer} from "../utility/search/request-search-transformer";

@Pipe({name: 'requestSort'})
export class RequestSortPipe implements PipeTransform {

  transform(requests: Request[],
            sort: Sort,
            reverseSort: boolean,
            filter: string,
            items: Item[],
            projects: Project[]): Request[] {
    const itemMap = new Map<string, Item>();
    items.forEach(item => itemMap.set(item.$key, item));

    const projectMap = new Map<string, Project>();
    projects.forEach(project => projectMap.set(project.$key, project));

    const filterTokens = filter.split(' ');
    const filteredRequests = requests.filter(request => {
      const item = itemMap.get(request.item);
      const project = projectMap.get(request.project);
      return filterTokens.every(token => this.requestMatchesSearch(request, item, project, token));
    });

    const sortedRequests = filteredRequests.sort(this.getSortFunction(sort, itemMap));
    return reverseSort ? sortedRequests.reverse() : sortedRequests;
  }

  getSortFunction(sort: Sort, itemMap: Map<string, Item>) {
    switch (sort) {
      case 'request added':
        return (a: Request, b: Request) => {
          return a.$key < b.$key ? -1 : 1;
        };
      case 'request cost':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);

          const costA = a.quantity * (itemA.cost || 0);
          const costB = b.quantity * (itemB.cost || 0);
          return costA < costB ? -1 : 1;
        };
      case 'item cost':
        return (a: Request, b: Request) => {
          const costA = itemMap.get(a.item).cost || 0;
          const costB = itemMap.get(b.item).cost || 0;
          return costA < costB ? -1 : 1;
        };
      case 'item name':
        return (a: Request, b: Request) => {
          const itemA = itemMap.get(a.item);
          const itemB = itemMap.get(b.item);
          return itemA.name < itemB.name ? -1 : 1;
        };
      case 'date needed':
        return (a: Request, b: Request) => {
          return a.date < b.date ? -1 : 1;
        };
    }
  }


  requestMatchesSearch(request: Request, item: Item, project: Project, token: string) {
    const requestStr = RequestSearchTransformer.transform(request, item, project);

    // Remove spaces, change to lowercase
    return requestStr.indexOf(token.toLowerCase()) != -1;
  }
}
