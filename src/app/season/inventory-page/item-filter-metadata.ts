import {
  AutocompleteContext,
  IFilterMetadata,
  MatcherContext
} from 'app/season/utility/search/filter';
import {DateQuery, InputQuery, NumberQuery, StateQuery} from 'app/season/utility/search/query';
import {
  dateMatchesEquality,
  numberMatchesEquality,
  stateMatchesEquality,
  stringContainsQuery
} from 'app/season/utility/search/query-matcher';
import {map} from 'rxjs/operators';

export const ItemFilterMetadata = new Map<string, IFilterMetadata>([

  /** InputQuery Filters */

  ['name', {
    displayName: 'Name',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.item.name, q);
    },
    autocomplete: (c: AutocompleteContext) => {
      return c.itemsDao.list.pipe(map(items => {
        return items.map(item => item.name);
      }));
    }
  }],

  ['category', {
    displayName: 'Category',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return c.item.categories.some(category => {
        return stringContainsQuery(category, q);
      });
    },
    autocomplete: (c: AutocompleteContext) => {
      return c.itemsDao.list.pipe(map(items => {
        return items.map(item => {
          return item.categories[0];
        });
      }));
    }
  }],

  ['itemUrl', {
    displayName: 'URL',
    queryType: 'input',
    matcher: (c: MatcherContext, q: InputQuery) => {
      return stringContainsQuery(c.item.url, q);
    }
  }],

  /** NumberQuery Filters */

  ['itemCost', {
    displayName: 'Cost',
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.item.cost, q);
    }
  }],

  /** DateQuery Filters */

  ['itemAdded', {
    displayName: 'Date Added',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.item.dateCreated, q);
    }
  }],

  ['itemModified', {
    displayName: 'Date Modified',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.item.dateModified, q);
    }
  }],

  /** StateQuery */

  ['state', {
    displayName: 'State',
    queryType: 'state',
    queryTypeData: {
      states: ['Hidden']
    },
    matcher: (c: MatcherContext, q: StateQuery) => {
      const values = new Map<string, boolean>([
        ['Hidden', !!c.item.hidden],
      ]);
      return stateMatchesEquality(values.get(q.state), q);
    },
  }],
]);
