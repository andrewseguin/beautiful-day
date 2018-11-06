import {ItemSearchTransformer} from 'app/utility/search/item-search-transformer';
import {Item} from '../../season/dao';

export function getItemsMatchingQuery(items: Item[], query: string): Item[] {
  const tokens = query.split(' ');
  return items.filter(item => {
    return tokens.every(token => itemMatchesSearch(item, token));
  });
}

export function itemMatchesSearch(item: Item, token: string) {
  return ItemSearchTransformer.transform(item).indexOf(token.toLowerCase()) != -1;
}
