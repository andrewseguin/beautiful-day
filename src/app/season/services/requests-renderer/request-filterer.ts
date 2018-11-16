import {Item, Project, Request} from 'app/season/dao';
import {RequestRendererOptions} from './request-renderer-options';
import {getRequestCost} from 'app/season/utility/request-cost';
import {DateEquality, NumberEquality, Query} from './query';

export class RequestFilterer {
  constructor(private options: RequestRendererOptions,
              private projectMap: Map<string, Project>,
              private itemMap: Map<string, Item>) {}

  filter(requests: Request[]) {
    return requests.filter(r => {
      return this.options.filters.every(filter => {
        const q = filter.query as Query;
        if (!q) {
          return true;
        }

        const project = this.projectMap.get(r.project);
        const item = this.itemMap.get(r.item);
        const requestCost = getRequestCost(item.cost, r);

        switch (filter.type) {
          case 'project': {
            return stringContainsQuery(project.name, q.input);
          }
          case 'projectKey': {
            return stringContainsQuery(r.project, q.input);
          }
          case 'purchaser': {
            return stringContainsQuery(r.purchaser, q.input);
          }
          case 'requestCost': {
            return numberMatchesEquality(requestCost, q.value, q.equality);
          }
          case 'itemCost': {
            return numberMatchesEquality(item.cost, q.value, q.equality);
          }
          case 'dropoffDate': {
            return dateMatchesEquality(r.date, q.date, q.equality);
          }
          case 'dropoffLocation': {
            return stringContainsQuery(r.dropoff, q.input);
          }
          default:
            throw Error(`Unknown filter type: ${filter.type}`);
        }
      });
    });
  }
}

function stringContainsQuery(str: string, query: string) {
  if (!str) {
    return false;
  }

  if (!query) {
    return true;
  }

  return str.toLowerCase().indexOf(query.toLowerCase()) !== -1;
}

function numberMatchesEquality(num: number, queryValue: number, equality: NumberEquality) {
  if (queryValue === undefined) {
    return true;
  }

  if (equality === 'greaterThan') {
    return  num > queryValue;
  } else if (equality === 'lessThan') {
    return num < queryValue;
  } else {
    return num === queryValue;
  }
}

function dateMatchesEquality(dateStr: string, queryDateStr: string, equality: DateEquality) {
  const date = new Date(dateStr);
  const queryDate = new Date(queryDateStr);

  if (equality === 'after') {
    return  date > queryDate;
  } else if (equality === 'before') {
    return date < queryDate;
  } else {
    return date.toISOString() === queryDate.toISOString();
  }
}
