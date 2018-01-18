import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Item} from '../model/item';
import {Observable} from 'rxjs/Observable';
import {DaoService} from './dao-service';
import * as firebase from 'firebase';
import {SelectionModel} from '@angular/cdk/collections';

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

@Injectable()
export class ItemsService extends DaoService<Item> {
  items: Observable<Item[]>;
  selection = new SelectionModel<string>(true);

  constructor(db: AngularFireDatabase) {
    super(db, 'items');
    this.items = this.getKeyedListDao();
  }

  /** Returns a map of the latest item costs. */
  getItemCosts(): Observable<Map<string, number>> {
    return this.items.map(items => {
      const itemCosts = new Map<string, number>();
      items.forEach(item => itemCosts.set(item.$key, item.cost));
      return itemCosts;
    });
  }

  getItemsWithCategory(category: string): Observable<Item[]> {
    const queryFn = ref => ref.orderByChild('category').equalTo(category);
    return this.queryList(queryFn);
  }

  getCategoryGroup(filter = ''): Observable<Category> {
    return this.items.map(allItems => {
      const categoryStrings = new Set<string>();
      const items = [];
      allItems.map(item => {
        item.categories.split(',')
          .map(c => c.trim())
          .filter(c => c.indexOf(filter) !== -1)
          .forEach(c => {
            // Add the remaining slice of the string without the filter
            categoryStrings.add(c.slice(filter.length));
            if (c === filter) { items.push(item); }
          });
      });

      const subcategoriesSet = new Set<string>();
      categoryStrings.forEach(categoryString => {
        const splitCategoryString = categoryString.split(' > ');
        let subcategory = filter ? splitCategoryString[1] : splitCategoryString[0];
        if (subcategory) {
          subcategoriesSet.add(subcategory.trim());
        }
      });

      const subcategories: string[] = [];
      subcategoriesSet.forEach(s => subcategories.push(s));
      subcategories.sort();
      return {items, subcategories};
    });
  }

  getItemsByCategory(): Observable<CategoryGroup> {
    return this.items.map(items => {
      const categoryGroups: CategoryGroup = {
        category: 'all',
        items: [],
        subcategories: {}
      };
      items.forEach(item => {
        const categories = item.categories.split(',');
        categories.forEach(category => {
          this.addItemToCategoryGroupMap(categoryGroups, item, category);
        });
      });
      return categoryGroups;
    });
  }

  private addItemToCategoryGroupMap(categoryGroups: CategoryGroup, item: Item, category: string) {
    const subcategories = category.trim().split('>');

    let prevGroup = categoryGroups;
    let group = categoryGroups;
    let subcategory;
    while (subcategory = subcategories.shift()) {
      group = this.getSubcategoryGroupCollection(prevGroup, subcategory);
      prevGroup = group;
    }

    group.items.push(item);
  }

  getSubcategoryGroupCollection(group: CategoryGroup, subcategory: string): CategoryGroup {
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

  add(item: Item): firebase.database.ThenableReference {
    // Set the dateMove the UTC date to user's time zone
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    item.dateAdded = new Date().getTime();

    return super.add(item);
  }

  updateItems(items: Item[]) {
    items.forEach(item => {
      if (item.$key) {
        const copiedItem = {...item};
        delete copiedItem['$key'];
        console.log(`Updating item with key ${item.$key}: `, copiedItem);
        this.update(item.$key, item);
      } else {
        console.log('Adding item', item);
        this.add(item);
      }
    })
  }

  getSelectedItems(): string[] {
    return this.selection.selected;
  }
}
