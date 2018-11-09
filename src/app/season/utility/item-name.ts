import {Item} from 'app/season/dao';

export function getItemName(item: Item) {
  const categories = item.categories[0].split('>');
  if (categories.length > 1) {
    categories.shift();
    const subcategories = categories.join('-');
    return `${subcategories} - ${item.name}`.trim();
  } else {
    return item.name.trim();
  }
}
