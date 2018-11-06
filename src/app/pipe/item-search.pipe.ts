import {Pipe, PipeTransform} from '@angular/core';
import {ItemSearchTransformer} from 'app/utility/search/item-search-transformer';
import {Item} from '../ui/season/dao';

@Pipe({name: 'itemSearch'})
export class ItemSearchPipe implements PipeTransform {

  transform(items: Item[], query: string): Item[] {
    const tokens = query.split(' ');
    return items.filter(item => {
      return tokens.every(token => this.itemMatchesSearch(item, token));
    });
  }

  itemMatchesSearch(item: Item, token: string) {
    return ItemSearchTransformer.transform(item).indexOf(token.toLowerCase()) != -1;
  }
}
