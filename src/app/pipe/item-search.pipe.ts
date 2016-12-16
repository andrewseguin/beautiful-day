import { Pipe, PipeTransform } from '@angular/core';
import {Item} from '../model/item';

@Pipe({
  name: 'itemSearch'
})
export class ItemSearchPipe implements PipeTransform {

  transform(items: Item[], query: string): any {
    const tokens = query.split(' ');
    return items.filter(item => {
      return tokens.every(token => this.itemMatchesSearch(item, token));
    });
  }

  itemMatchesSearch(item: Item, token: string) {
    let itemStr = (item.name + item.type + item.category + item.url).toLowerCase();
    return itemStr.indexOf(token.toLowerCase()) != -1;
  }
}
