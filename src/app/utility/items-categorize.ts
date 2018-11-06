import {Item} from 'app/ui/season/dao';

export type CategoryGroupCollection = { [name: string]: CategoryGroup };

export class CategoryGroup {
  category?: string;
  items?: Item[];
  subcategories: CategoryGroupCollection;
}

export class Category {
  items: Item[];
  subcategories: string[];
}

export function getCategoryGroup(allItems: Item[], filter = '', showHidden = false): Category {
  const categoryStrings = new Set<string>();
  const items = [];

  allItems.map(item => {
    if (item.hidden && !showHidden) { return; }

    item.categories
      .map(c => c.trim())
      .filter(c => {
        if (!filter) { return true; }

        const filterIsPresent = c.indexOf(filter) !== -1;
        if (filterIsPresent) {
          const tokens = c.slice(filter.length);
          const hasRemainingWords = !!tokens.split('>')[0].trim();
          return !hasRemainingWords;
        }
      })
      .forEach(c => {
        // Add the remaining slice of the string without the filter
        categoryStrings.add(c.slice(filter.length));
        if (c === filter) { items.push(item); }
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

export function getItemsByCategory(items: Item[], showHidden = false): CategoryGroup {
  const categoryGroups: CategoryGroup = {
    category: 'all',
    items: [],
    subcategories: {}
  };
  items.forEach(item => {
    if (item.hidden && !showHidden) { return; }

    item.categories.forEach(category => {
      addItemToCategoryGroupMap(categoryGroups, item, category);
    });
  });

  return categoryGroups;
}

function addItemToCategoryGroupMap(
  categoryGroups: CategoryGroup, item: Item, category: string) {
  const subcategories = category.trim().split('>');

  let prevGroup = categoryGroups;
  let group = categoryGroups;
  let subcategory;
  while (subcategory = subcategories.shift()) {
    group = getSubcategoryGroupCollection(prevGroup, subcategory);
    prevGroup = group;
  }

  group.items.push(item);
}

function getSubcategoryGroupCollection(
  group: CategoryGroup, subcategory: string): CategoryGroup {
  subcategory = subcategory.trim();
  let subcategoryGroup = group.subcategories[subcategory];
  if (!subcategoryGroup) {
    group.subcategories[subcategory] = {
      category: subcategory,
      subcategories: {},
      items: []
    };
  }

  return group.subcategories[subcategory];
}
