import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import {Item} from '../model/item';
import {Observable} from 'rxjs';
import {transformSnapshotActionList} from '../utility/snapshot-tranform';

export type CategoryGroupCollection = { [name: string]: CategoryGroup };

export class CategoryGroup {
  category: string;
  items: Item[];
}

@Injectable()
export class ItemsService {
  selectedItems: Set<string> = new Set();

  constructor(private db: AngularFireDatabase) {}

  getItems(): Observable<Item[]> {
    return this.db.list('items').snapshotChanges().map(items => {
      return items.map(item => {
        let val: Item = item.payload.val();
        val.$key = item.key;
        return val;
      });
    });
  }

  /** Returns a map of the latest item costs. */
  getItemCosts(): Observable<Map<string, number>> {
    return this.db.list('items').snapshotChanges().map(transformSnapshotActionList).map(items => {
      const itemCosts = new Map<string, number>();
      items.forEach(item => itemCosts.set(item.$key, item.cost));
      return itemCosts;
    });
  }

  getItemsWithCategory(category: string): Observable<Item[]> {
    return this.db.list('items', ref => ref.orderByChild('category').equalTo(category)).snapshotChanges().map(transformSnapshotActionList);
  }

  getItemsByCategory(): Observable<CategoryGroupCollection> {
    return this.getItems().map(items => {
      const categoryGroupsMap: CategoryGroupCollection = {};

      items.forEach(item => {
        const categories = item.categories.split(',');
        categories.forEach(category => {
          category = category.trim();
          if (!categoryGroupsMap[category]) {
            categoryGroupsMap[category] = {
              category: category,
              items: []
            }
          }

          categoryGroupsMap[category].items.push(item);
        })
      });

      return categoryGroupsMap;
    });
  }

  getItem(id: string): AngularFireObject<Item> {
    return this.db.object(`items/${id}`);
  }

  createItem(item: Item) {
    // Set the dateMove the UTC date to user's time zone
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    item.dateAdded = new Date().getTime();

    this.db.list<Item>('items').push(item);
  }

  setSelected(id: string, value: boolean) {
    if (value) {
      this.selectedItems.add(id);
    } else {
      this.selectedItems.delete(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedItems.has(id);
  }

  clearSelected() {
    this.selectedItems = new Set();
  }

  getSelectedItems(): Set<string> {
    return this.selectedItems;
  }

  setAllItems(items: Item[]) {
    this.db.object('items').set(items);
  }
}
