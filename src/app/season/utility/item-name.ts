import {Item} from 'app/season/dao';

export function getItemName(item: Item) {
  const categories = item.categories[0].split('>');
  if (categories.length > 1) {
    categories.shift();
    const subcategories = categories.join('-');
    return `${subcategories} - ${item.name}`;
  } else {
    return item.name;
  }
}
