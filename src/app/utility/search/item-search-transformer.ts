import {Item} from 'app/ui/season/dao';

export class ItemSearchTransformer {
  static transform(item: Item): string {
    const itemStr = item.name + item.categories + item.url + item.cost + item.keywords;
    return itemStr.toLowerCase();
  }
}
