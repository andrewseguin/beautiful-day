import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Item} from '../model/item';
import {Observable} from 'rxjs/Observable';
import {DaoService} from './dao-service';
import * as firebase from 'firebase';
import {SelectionModel} from '@angular/cdk/collections';
import {UsersService} from 'app/service/users.service';
import {AuthService} from 'app/service/auth-service';
import {map} from 'rxjs/operators';

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
  currentUser: string;


  constructor(db: AngularFireDatabase, private authSerice: AuthService) {
    super(db, 'items');
    this.items = this.getKeyedListDao();


    this.authSerice.user.subscribe(user => {
      this.currentUser = user ? user.email : '';
    });
  }

  /** Returns a map of the latest item costs. */
  getItemCosts(): Observable<Map<string, number>> {
    return this.items.pipe(map(items => {
      const itemCosts = new Map<string, number>();
      items.forEach(item => itemCosts.set(item.$key, item.cost));
      return itemCosts;
    }));
  }

  getItemsWithCategory(category: string): Observable<Item[]> {
    const queryFn = ref => ref.orderByChild('category').equalTo(category);
    return this.queryList(queryFn);
  }

  getCategoryGroup(filter = '', showHidden = false): Observable<Category> {
    return this.items.pipe(map(allItems => {
      const categoryStrings = new Set<string>();
      const items = [];
      allItems.map(item => {
        if (item.hidden && !showHidden) { return; }

        item.categories.split(',')
          .map(c => c.trim())
          .filter(c => {
            if (!filter) { return true; }

            const filterIsPresent = c.indexOf(filter) !== -1;
            if (filterIsPresent) {
              const tokens = c.slice(filter.length);
              const hasRemainingWords = !!tokens.split('>')[0].trim();
              if (hasRemainingWords) {
                // Matched something like "Paint" to "Paint Supplies"
                return false;
              }
              return true;
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
    }));
  }

  getItemsByCategory(showHidden = false): Observable<CategoryGroup> {
    return this.items.pipe(map(items => {
      const categoryGroups: CategoryGroup = {
        category: 'all',
        items: [],
        subcategories: {}
      };
      items.forEach(item => {
        if (item.hidden && !showHidden) { return; }

        const categories = item.categories.split(',');
        categories.forEach(category => {
          this.addItemToCategoryGroupMap(categoryGroups, item, category);
        });
      });
      return categoryGroups;
    }));
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

  add(item: Item, isBulk = false): firebase.database.ThenableReference {
    // Set the dateMove the UTC date to user's time zone
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    item.dateAdded = new Date().getTime();

    // Add current user's email to the item
    item.addedBy = this.currentUser;

    // Unless this is a bulk add (import TSV)
    if (isBulk) {
      item.addedBy = '';
    }

    return super.add(item);
  }

  updateItems(items: Item[]) {
    items.forEach(item => {
      const copiedItem: Item = {...item};
      delete copiedItem.$key;
      if (item.$key) {
        console.log(`Updating item with key ${item.$key}: `, copiedItem);
        this.update(item.$key, copiedItem);
      } else {
        console.log('Adding item', copiedItem);
        this.add(copiedItem, true);
      }
    });
  }

  getSelectedItems(): string[] {
    return this.selection.selected;
  }
}
