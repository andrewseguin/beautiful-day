import {Injectable} from "@angular/core";
import {FirebaseObjectObservable, FirebaseListObservable, AngularFireDatabase} from "angularfire2";
import {Item} from "../model/item";
import {Observable} from "rxjs";

export type CategoryGroupCollection = { [name: string]: CategoryGroup };

export class CategoryGroup {
  category: string;
  items: Item[];
}

@Injectable()
export class ItemsService {
  selectedItems: Set<string> = new Set();

  constructor(private db: AngularFireDatabase) {}

  getItems(): FirebaseListObservable<Item[]> {
    return this.db.list('items');
  }

  getItemsWithCategory(category: string): FirebaseListObservable<Item[]> {
    return this.db.list('items', {
      query: {
        orderByChild: 'category',
        equalTo: category
      }
    });
  }

  getItemsByCategory(): Observable<CategoryGroupCollection> {
    return this.getItems().map(items => {
      const categoryGroupsMap: CategoryGroupCollection = {};

      items.forEach(item => {
        const categories = item.categories.split(';');
        categories.forEach(category => {
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

  getItem(id: string): FirebaseObjectObservable<Item> {
    return this.db.object(`items/${id}`);
  }

  createItem(item: Item) {
    // Set the dateMove the UTC date to user's time zone
    const date = new Date();
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    item.dateAdded = new Date().getTime();

    this.getItems().push(item);
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
