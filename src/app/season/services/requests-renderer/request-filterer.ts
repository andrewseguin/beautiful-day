import {Item, Project, Request} from 'app/season/dao';
import {
  FilterCostQuery,
  FilterDateQuery,
  FilterDropoffLocationQuery,
  FilterProjectKeyQuery,
  FilterProjectQuery,
  FilterPurchaserQuery,
  RequestRendererOptions
} from 'app/season/services/requests-renderer/request-renderer-options';
import {getRequestCost} from 'app/season/utility/request-cost';

export class RequestFilterer {

  constructor(private options: RequestRendererOptions,
              private projectMap: Map<string, Project>,
              private itemMap: Map<string, Item>) {}

  filter(requests: Request[]) {
    return requests.filter(request => {
      return this.options.filters.every(filter => {
        switch (filter.type) {
          case 'project': {
            const query = filter.query as FilterProjectQuery;
            return this.matchesProject(query, request);
          }
          case 'projectKey': {
            const query = filter.query as FilterProjectKeyQuery;
            return this.matchesProjectKey(query, request);
          }
          case 'purchaser': {
            const query = filter.query as FilterPurchaserQuery;
            return this.matchesPurchaser(query, request);
          }
          case 'request cost': {
            const query = filter.query as FilterCostQuery;
            return this.matchesRequestCost(query, request);
          }
          case 'item cost': {
            const query = filter.query as FilterCostQuery;
            return this.matchesItemCost(query, request);
          }
          case 'dropoff date': {
            const query = filter.query as FilterDateQuery;
            return this.matchesDropoffDate(query, request);
          }
          case 'dropoff location': {
            const query = filter.query as FilterDropoffLocationQuery;
            return this.matchesDropoffLocation(query, request);
          }
        }
      });
    });
  }

  matchesProject(query: FilterProjectQuery, request: Request) {
    if (!query || !query.project) {
      return true;
    }

    const projectName = this.projectMap.get(request.project).name.toLowerCase();
    const queryProjectName = query.project.toLowerCase();
    return projectName.indexOf(queryProjectName) != -1;
  }

  matchesProjectKey(query: FilterProjectKeyQuery, request: Request) {
    return !query || !query.key || request.project === query.key;
  }

  matchesPurchaser(query: FilterPurchaserQuery, request: Request) {
    if (!query || !query.purchaser) {
      return true;
    }

    if (!request.purchaser) {
      return false;
    }

    const requestPurchaser = request.purchaser.toLowerCase();
    const queryPurchaser = query.purchaser.toLowerCase();
    return requestPurchaser.indexOf(queryPurchaser) != -1;
  }

  matchesRequestCost(query: FilterCostQuery, request: Request) {
    if (!query || query.cost === undefined) {
      return true;
    }

    const itemCost = this.itemMap.get(request.item).cost;
    const requestCost = getRequestCost(itemCost, request);

    if (query.equality === 'greater than') {
      return  requestCost > query.cost;
    } else if (query.equality === 'less than') {
      return requestCost < query.cost;
    } else {
      return requestCost === query.cost;
    }
  }

  matchesItemCost(query: FilterCostQuery, request: Request) {
    if (!query || query.cost === undefined) {
      return true;
    }

    const itemCost = this.itemMap.get(request.item).cost;
    if (query.equality === 'greater than') {
      return  itemCost > query.cost;
    } else if (query.equality === 'less than') {
      return itemCost < query.cost;
    } else {
      return itemCost === query.cost;
    }
  }

  matchesDropoffDate(query: FilterDateQuery, request: Request) {
    if (!query || query.date === undefined) {
      return true;
    }

    const requestDate = new Date(request.date);
    const queryDate = new Date(query.date);

    if (query.equality === 'after') {
      return  requestDate > queryDate;
    } else if (query.equality === 'before') {
      return requestDate < queryDate;
    } else {
      return requestDate === queryDate;
    }
  }

  matchesDropoffLocation(query: FilterDropoffLocationQuery, request: Request) {
    if (!query || !query.location) {
      return true;
    }

    const requestLocation = request.dropoff.toLowerCase();
    const queryLocation = query.location.toLowerCase();
    return requestLocation.indexOf(queryLocation) != -1;
  }
}
