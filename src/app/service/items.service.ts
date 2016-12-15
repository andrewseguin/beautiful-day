import {Injectable} from '@angular/core';
import {FirebaseObjectObservable, FirebaseListObservable, AngularFire} from "angularfire2";
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

  constructor(private af: AngularFire) {}

  getItems(): FirebaseListObservable<Item[]> {
    return this.af.database.list('items');
  }

  getItemsByCategory(): Observable<CategoryGroupCollection> {
    return this.getItems().map(items => {
      const categoryGroupsMap: CategoryGroupCollection= {};

      items.forEach(item => {
        const category = item.category;
        if (!categoryGroupsMap[category]) {
          categoryGroupsMap[category] = {
            category: category,
            items: []
          }
        }

        categoryGroupsMap[category].items.push(item);
      });

      return categoryGroupsMap;
    });
  }

  getItem(id: string): FirebaseObjectObservable<Item> {
    return this.af.database.object(`items/${id}`);
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
}
