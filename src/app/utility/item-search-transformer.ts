import {Item} from "../model/item";

export class ItemSearchTransformer {
  static transform(item: Item): string {
    let categories = item.categories.split(',');
    let categorySearch = categories.map(category => `[category]:${category.trim().replace(' ', '_')}`);

    const itemStr = `[item]:${item.name}${item.type}`;
    const name = `[name]:${item.name}`;
    const type = `[type]:${item.type}`;
    const url = `[url]:${item.url}`;

    return (itemStr + name + type + categorySearch + url + item.keywords).replace(/ /g, '').toLowerCase();
  }
}
