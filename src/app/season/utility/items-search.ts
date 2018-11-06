import {tokenizeItem} from 'app/season/utility/tokenize';
import {Item} from 'app/season/dao';

export function getItemsMatchingQuery(items: Item[], query: string): Item[] {
  const tokens = query.split(' ');
  return items.filter(item => {
    return tokens.every(token => {
      return tokenizeItem(item).indexOf(token.toLowerCase()) != -1;
    });
  });
}
