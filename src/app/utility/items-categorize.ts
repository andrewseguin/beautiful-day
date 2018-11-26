import {Item} from 'app/season/dao';

export class Category {
  items: Item[];
  subcategories: string[];
}

export function getCategoryGroup(allItems: Item[], filter = ''): Category {
  const categoryStrings = new Set<string>();
  const items = [];

  allItems.map(item => {
    if (item.hidden) { return; }

    let categories = item.categories.map(c => c.trim());

    if (filter) {
      categories = categories.filter(category => {
        if (category.indexOf(filter) !== -1) {
          const tokens = category.slice(filter.length);
          return !tokens.split('>')[0].trim();
        }
      });
    }

    categories.forEach(category => {
        // Add the remaining slice of the string without the filter
        categoryStrings.add(category.slice(filter.length));
        if (category === filter) { items.push(item); }
      });
  });

  const subcategoriesSet = new Set<string>();
  categoryStrings.forEach(categoryString => {
    const splitCategoryString = categoryString.split('>');
    let subcategory = filter ? splitCategoryString[1] : splitCategoryString[0];
    if (subcategory) {
      subcategoriesSet.add(subcategory.trim());
    }
  });

  const subcategories: string[] = [];
  subcategoriesSet.forEach(s => subcategories.push(s));
  subcategories.sort();
  return {items, subcategories};
}
