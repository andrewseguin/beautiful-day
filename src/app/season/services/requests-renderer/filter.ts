import {DateQuery, InputQuery, NumberQuery, Query} from './query';
import {Item, ItemsDao, Project, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {dateMatchesEquality, numberMatchesEquality, stringContainsQuery} from './query-matcher';
import {getRequestCost} from 'app/season/utility/request-cost';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ListDao} from 'app/utility/list-dao';
import {getItemName} from 'app/season/utility/item-name';

export interface MatcherContext {
  request: Request;
  project: Project;
  item: Item;
}

export interface AutocompleteContext {
  itemsDao: ItemsDao;
  requestsDao: RequestsDao;
  projectsDao: ProjectsDao;
}

export interface IFilterMetadata {
  displayName?: string;  // If present, will display as an option to the user
  queryType?: string;
  matcher?: (c: MatcherContext, q: Query) => boolean;
  autocomplete?: (c: AutocompleteContext) => Observable<string[]>;
}

export const FilterMetadata = new Map<string, IFilterMetadata>([

  /** InputQuery Filters */

  ['project', {
    displayName: 'Project',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.project.name, q);
    },
    autocomplete: (c: AutocompleteContext) => {
      return getValuesFromList(c.projectsDao, 'name');
    }
  }],

  ['projectKey', {
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.project.id, q);
    }
  }],

  ['purchaser', {
    displayName: 'Purchaser',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.request.purchaser, q);
    },
    autocomplete: (c: AutocompleteContext) => {
      return getValuesFromList(c.requestsDao, 'purchaser');
    }
  }],

  ['dropoffLocation', {
    displayName: 'Dropoff',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.request.dropoff, q);
    },
    autocomplete: (c: AutocompleteContext) => {
      return getValuesFromList(c.requestsDao, 'dropoff');
    }
  }],

  ['note', {
    displayName: 'Note',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.request.note, q);
    }
  }],

  ['tags', {
    displayName: 'Tags',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery((c.request.tags || []).join(' '), q);
    }
  }],

  ['itemName', {
    displayName: 'Item Name',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      const itemName = c.item.categories[0] + getItemName(c.item);
      return stringContainsQuery(itemName, q);
    },
    autocomplete: (c: AutocompleteContext) => {
      return c.itemsDao.list.pipe(map(items => {
        return items.map(item => {
          return item.categories[0] + getItemName(item);
        });
      }));
    }
  }],

  ['itemUrl', {
    displayName: 'Item URL',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.item.url, q);
    }
  }],

  /** NumberQuery Filters */

  ['requestCost', {
    displayName: 'Request Cost',
    queryType: 'numberEquality',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(getRequestCost(c.item.cost, c.request), q);
    }
  }],

  ['itemCost', {
    displayName: 'Item Cost',
    queryType: 'numberEquality',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.item.cost, q);
    }
  }],

  ['allocation', {
    displayName: 'Allocation',
    queryType: 'numberEquality',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.request.allocation, q);
    }
  }],

  ['quantity', {
    displayName: 'Quantity',
    queryType: 'numberEquality',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.request.quantity, q);
    }
  }],

  /** DateQuery Filters */

  ['dropoffDate', {
    displayName: 'Dropoff Date',
    queryType: 'dateEquality',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.date, q);
    }
  }],

  ['distributionDate', {
    displayName: 'Distribution Date',
    queryType: 'dateEquality',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.distributionDate, q);
    }
  }],

  ['requestAdded', {
    displayName: 'Request Added',
    queryType: 'dateEquality',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.dateAdded, q);
    }
  }],

  ['requestModified', {
    displayName: 'Request Modified',
    queryType: 'dateEquality',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.dateModified, q);
    }
  }],

  /** StateQuery */

  // Request:
  // State     Status: purchased, received, distributed
]);

export interface Filter {
  type: string;
  query?: InputQuery | NumberQuery | DateQuery;
  isImplicit?: boolean;
}

function getValuesFromList(listDao: ListDao<any>, property: string): Observable<string[]> {
  return listDao.list.pipe(map((list: any[]) => {
    if (!list) {
      return [];
    }

    const values = list.map(r => r[property]).filter(p => !!p);
    return Array.from(new Set(values));
  }));
}
