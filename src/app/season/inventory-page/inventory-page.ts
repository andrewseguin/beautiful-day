import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatSelect} from '@angular/material';
import {Selection} from 'app/season/services';
import {Item, ItemsDao} from 'app/season/dao';
import {CategoryGroup, getItemsByCategory} from 'app/utility/items-categorize';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {getItemsMatchingQuery} from '../utility/items-search';

@Component({
  templateUrl: 'inventory-page.html',
  styleUrls: ['inventory-page.scss'],
})
export class InventoryPage implements OnInit {
  itemsToShow = 10;
  items: Item[];
  categoryGroup: CategoryGroup;
  selectedCategories = [];
  categorySelections = [];
  displayedItems: Item[] = [];

  private destroyed = new Subject();

  @ViewChildren('categorySelect') categorySelects: QueryList<MatSelect>;

  _search = '';
  set search(search: string) {
    this._search = search;
    this.updateDisplayedItems();
  }
  get search(): string { return this._search; }

  constructor(private itemsDao: ItemsDao, private selection: Selection) { }

  ngOnInit() {
    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      this.items = items || [];
      this.updateDisplayedItems();
    });

    this.itemsDao.list.pipe(takeUntil(this.destroyed)).subscribe(items => {
      this.categoryGroup = getItemsByCategory(items || []);
      this.updateCategorySelectionOptions();
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.selection.items.clear();
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
        const categories = i.categories.map(c => c.trim());

        const exactMatch = categories.join() === this.selectedCategories.join();
        const matchesSubcategory =
            categories.join().indexOf(this.selectedCategories.join() + ' >') == 0;
        return exactMatch || matchesSubcategory;
      });
    }

    this.displayedItems = getItemsMatchingQuery(this.displayedItems, this.search);
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
