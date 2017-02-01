import {Pipe, PipeTransform} from "@angular/core";
import {Sort} from "../ui/shared/requests-list/requests-group/requests-group.component";
import {Request} from "../model/request";
import {Item} from "../model/item";
import {Project} from "../model/project";

@Pipe({name: 'requestSort'})
export class RequestSortPipe implements PipeTransform {

  transform(requests: Request[],
            sort: Sort,
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

          const costA = a.quantity * (itemA.cost || 0);
          const costB = b.quantity * (itemB.cost || 0);
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


  requestMatchesSearch(request: Request, item: Item, project: Project, token: string) {
    const requestStr = (request.dropoff + request.note + request.quantity + request.tags + project.name).toLowerCase();
    const itemStr = (item.name + item.type + item.categories + item.url).toLowerCase();
    return requestStr.indexOf(token.toLowerCase()) != -1 ||
        itemStr.indexOf(token.toLowerCase()) != -1;
  }
}
