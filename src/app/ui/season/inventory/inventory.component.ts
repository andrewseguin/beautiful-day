import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Item} from 'app/model/item';
import {MatSelect} from '@angular/material';
import {ItemSearchPipe} from 'app/pipe/item-search.pipe';
import {Selection} from 'app/ui/season/services';
import {ItemsDao} from 'app/ui/season/dao';
import {CategoryGroup, getItemsByCategory} from 'app/utility/items-categorize';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  itemsToShow = 10;
  items: Item[];
  categoryGroup: CategoryGroup;
  itemSearch = new ItemSearchPipe();
  selectedCategories = [];
  categorySelections = [];
  displayedItems: Item[] = [];

  @ViewChildren('categorySelect') categorySelects: QueryList<MatSelect>;

  _search = '';
  set search(search: string) {
    this._search = search;
    this.updateDisplayedItems();
  }
  get search(): string { return this._search; }

  constructor(private itemsDao: ItemsDao, private selection: Selection) { }

  ngOnInit() {
    this.itemsDao.list.subscribe(items => {
      this.items = items || [];
      this.updateDisplayedItems();
    });

    this.itemsDao.list.subscribe(items => {
      this.categoryGroup = getItemsByCategory(items || []);
      this.updateCategorySelectionOptions();
    });
  }

  updateCategorySelectionOptions() {
    let categoryGroup = this.categoryGroup;

    // Reset the set of options to display, will rebuild
    this.categorySelections = [];

    // Set the number of selects to expect
    let selects = this.selectedCategories.length + 1;

    // For each select, fill in the selection options and stop when no more subcategories show
    // or we run out of selected values
    for (let i = 0; i < selects; i++) {
      const subcategories = Object.keys(categoryGroup.subcategories);
      categoryGroup = categoryGroup.subcategories[this.selectedCategories[i]];

      // Fill in the subcategories if they exist, otherwise stop populating options
      if (subcategories.length) {
        this.categorySelections[i] = subcategories.sort();
      } else {
        break;
      }
    }

    // In case categories changed from underneath the selection, make sure that the number of
    // selected values don't exceed what is now shown.
    if (this.selectedCategories.length > this.categorySelections.length) {
      this.selectedCategories = this.selectedCategories.slice(0, this.categorySelections.length);
      this.updateDisplayedItems();
    }
  }

  onSelectedCategoryChange(value: string, i: number) {
    // Reduce selection so that this change is the latest value.
    this.selectedCategories = this.selectedCategories.slice(0, i);

    if (value) {
      this.selectedCategories[i] = value;
    }

    this.updateCategorySelectionOptions();
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    this.displayedItems = this.items;

    if (this.selectedCategories.length > 0) {
      this.displayedItems = this.displayedItems.filter(i => {
        const categories = i.categories.split('>').map(c => c.trim());

        const exactMatch = categories.join() === this.selectedCategories.join();
        const matchesSubcategory =
            categories.join().indexOf(this.selectedCategories.join() + ' >') == 0;
        return exactMatch || matchesSubcategory;
      });
    }

    this.displayedItems = this.itemSearch.transform(this.displayedItems, this.search);
  }

  ngOnDestroy() {
    this.selection.items.clear();
  }

  hasAllSelectedItems(): boolean {
    return this.displayedItems.every(item => {
      return this.selection.items.isSelected(item.id);
    });
  }

  toggleGroupSelection() {
    const itemKeys = this.displayedItems.map(item => item.id);
    this.selection.items.select(...itemKeys);
  }
}
