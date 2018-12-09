import {DateQuery, InputQuery, NumberQuery, StateQuery} from '../../utility/search/query';
import {Project} from 'app/season/dao';
import {
  dateMatchesEquality,
  numberMatchesEquality,
  stateMatchesEquality,
  stringContainsQuery
} from 'app/season/utility/search/query-matcher';
import {getRequestCost} from 'app/season/utility/request-cost';
import {map} from 'rxjs/operators';
import {getItemName} from 'app/season/utility/item-name';
import {
  AutocompleteContext,
  IFilterMetadata,
  MatcherContext
} from 'app/season/utility/search/filter';
import {getValuesFromList} from 'app/season/utility/search/autocomplete';

export const RequestFilterMetadata = new Map<string, IFilterMetadata>([

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
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(getRequestCost(c.item.cost, c.request), q);
    }
  }],

  ['itemCost', {
    displayName: 'Item Cost',
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.item.cost, q);
    }
  }],

  ['allocation', {
    displayName: 'Allocation',
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.request.allocation, q);
    }
  }],

  ['quantity', {
    displayName: 'Quantity',
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.request.quantity, q);
    }
  }],

  /** DateQuery Filters */

  ['dropoffDate', {
    displayName: 'Dropoff Date',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.date, q);
    }
  }],

  ['distributionDate', {
    displayName: 'Distribution Date',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.distributionDate, q);
    }
  }],

  ['requestAdded', {
    displayName: 'Request Added',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.dateCreated, q);
    }
  }],

  ['requestModified', {
    displayName: 'Request Modified',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.request.dateModified, q);
    }
  }],

  /** StateQuery */

  ['state', {
    displayName: 'Status',
    queryType: 'state',
    queryTypeData: {
      states: ['approved', 'purchased', 'distributed', 'previously approved']
    },
    matcher: (c: MatcherContext, q: StateQuery) => {
      const values = new Map<string, boolean>([
        ['approved', c.request.isApproved],
        ['purchased', c.request.isPurchased],
        ['distributed', c.request.isDistributed],
        ['previously approved', !!c.request.prevApproved],
      ]);
      return stateMatchesEquality(values.get(q.state), q);
    },
  }],
]);
