import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Item} from '../model/item';
import {Observable} from 'rxjs/Observable';
import {DaoService} from './dao-service';
import * as firebase from 'firebase';
import {SelectionModel} from '@angular/cdk/collections';

export type CategoryGroupCollection = { [name: string]: CategoryGroup };

export class CategoryGroup {
  category: string;
  items: Item[];
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

  getItemsByCategory(): Observable<CategoryGroupCollection> {
    return this.items.map(items => {
      const categoryGroupsMap: CategoryGroupCollection = {};

      items.forEach(item => {
        const categories = item.categories.split(',');
        categories.forEach(category => {
          category = category.trim();
          if (!categoryGroupsMap[category]) {
            categoryGroupsMap[category] = {
              category: category,
              items: []
            };
          }

          categoryGroupsMap[category].items.push(item);
        });
      });

      return categoryGroupsMap;
    });
  }

  add(item: Item): firebase.database.ThenableReference {
    // Set the dateMove the UTC date to user's time zone
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    item.dateAdded = new Date().getTime();

    return super.add(item);
  }

  setAllItems(items: Item[]) {
    this.db.object(this.ref).set(items);
  }

  getSelectedItems(): string[] {
    return this.selection.selected;
  }
}
