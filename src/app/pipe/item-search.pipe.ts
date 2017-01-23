import { Pipe, PipeTransform } from '@angular/core';
import {Item} from '../model/item';

@Pipe({name: 'itemSearch'})
export class ItemSearchPipe implements PipeTransform {

  transform(items: Item[], query: string): Item[] {
    const tokens = query.split(' ');
    return items.filter(item => {
      return tokens.every(token => this.itemMatchesSearch(item, token));
    });
  }

  itemMatchesSearch(item: Item, token: string) {
    const name = `[name]:${item.name}`;
    const type = `[type]:${item.type}`;
    const category = `[category]:${item.category.replace(' ', '_')}`;
    const url = `[url]:${item.url}`;

    let itemStr = (name + type + category + url).toLowerCase();
    return itemStr.indexOf(token.toLowerCase()) != -1;
  }
}
