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
import {getItemName} from 'app/season/utility/item-name';
import {map} from 'rxjs/operators';

export const ItemFilterMetadata = new Map<string, IFilterMetadata>([

  /** InputQuery Filters */

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

  ['itemCost', {
    displayName: 'Item Cost',
    queryType: 'number',
    matcher: (c: MatcherContext, q: NumberQuery) => {
      return numberMatchesEquality(c.item.cost, q);
    }
  }],

  /** DateQuery Filters */

  ['itemAdded', {
    displayName: 'Item Added',
    queryType: 'date',
    matcher: (c: MatcherContext, q: DateQuery) => {
      return dateMatchesEquality(c.item.dateCreated, q);
    }
  }],

  ['itemModified', {
    displayName: 'Item Modified',
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
      return stateMatchesEquality(values[q.state], q);
    },
  }],
]);
