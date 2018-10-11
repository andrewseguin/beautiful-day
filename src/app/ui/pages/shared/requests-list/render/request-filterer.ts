import {Request} from 'app/model/request';
import {Project} from 'app/model/project';
import {Item} from 'app/model/item';
import {
  FilterCostQuery, FilterDateQuery, FilterDropoffLocationQuery,
  FilterProjectKeyQuery,
  FilterProjectQuery, FilterPurchaserQuery, RequestRendererOptions
} from 'app/ui/pages/shared/requests-list/render/request-renderer-options';
import {getRequestCost} from 'app/service/accounting.service';

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
            if (!query || !query.project) {
              return true;
            }

            const projectName = this.projectMap.get(request.project).name.toLowerCase();
            const queryProjectName = query.project.toLowerCase();
            return projectName.indexOf(queryProjectName) != -1;
          }
          case 'projectKey': {
            const query = filter.query as FilterProjectKeyQuery;
            return !query || !query.key || request.project === query.key;
          }
          case 'purchaser': {
            const query = filter.query as FilterPurchaserQuery;
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
          case 'request cost': {
            const query = filter.query as FilterCostQuery;
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
          case 'item cost': {
            const query = filter.query as FilterCostQuery;
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
          case 'dropoff date': {
            const query = filter.query as FilterDateQuery;
            if (!query || query.date === undefined) {
              return true;
            }

            if (query.equality === 'after') {
              return  request.date > query.date;
            } else if (query.equality === 'before') {
              return request.date < query.date;
            } else {
              return request.date === query.date;
            }
          }
          case 'dropoff location': {
            const query = filter.query as FilterDropoffLocationQuery;
            if (!query || !query.location) {
              return true;
            }

            const requestLocation = request.dropoff.toLowerCase();
            const queryLocation = query.location.toLowerCase();
            return requestLocation.indexOf(queryLocation) != -1;
          }
        }
      });
    });
  }
}
