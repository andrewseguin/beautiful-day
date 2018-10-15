import {Item} from 'app/model/item';

export class ItemSearchTransformer {
  static transform(item: Item): string {
    const itemStr = item.name + item.categories + item.url + item.cost + item.keywords;
    return itemStr.toLowerCase();
  }
}
