import { Injectable } from '@angular/core';
import {RequestsService} from "./requests.service";
import {Request} from "../model/request";
import {ItemsService} from "./items.service";
import {Item} from "../model/item";
import {Subject} from 'rxjs';

export type Group = 'all' | 'category' | 'project' | 'date' | 'dropoff' | 'tags';

export class RequestGroup {
  id: string;
  title: string;
  requests: Request[]
}

@Injectable()
export class RequestGroupingService {
  requestGroups: Map<Group, RequestGroup[]> = new Map();
  items: Item[];
  categories: string[];

  groupsUpdated: Subject<Map<Group, RequestGroup[]>> = new Subject();

  _requests: Request[] = [];
  set requests(r) { this._requests = r; this.updateGroups(); }
  get requests(): Request[] { return this._requests; }

  constructor(private itemsService: ItemsService) {
    this.requestGroups.set('all', []);
    this.requestGroups.set('category', []);
    this.requestGroups.set('date', []);
    this.requestGroups.set('dropoff', []);
    this.requestGroups.set('tags', []);

    this.itemsService.getItems().subscribe(items => {
      this.items = items;

      // Get all unique categories from the set of items.
      const categoriesSet = new Set();
      items.forEach(item => {
        const itemCategories = item.categories.split(',');
        itemCategories.forEach(itemCategory => categoriesSet.add(itemCategory.trim()));
      });

      this.categories = [];
      categoriesSet.forEach(category => this.categories.push(category));

      this.updateGroups();
    });
  }

  getGroupNames(): string[] {
    return ['all', 'category', 'date', 'dropoff', 'tags'];
  }

  updateGroups() {
    this.updateGroupAll();
    this.updateGroupDropoffLocation();
    this.updateGroupDateNeeded();
    this.updateGroupCategory();
    this.updateGroupTags();

    // Return a clone of the map of request groups so that change detection will know to run.
    this.groupsUpdated.next(new Map(this.requestGroups));
  }

  updateGroupAll() {
    this.requestGroups.set('all', [{
      id: 'all',
      title: `All (${this.requests.length} requests)`,
      requests: this.requests
    }]);
  }

  updateGroupDropoffLocation() {
    const dropoffGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by dropoff
    this.requests.forEach(request => {
      if (!dropoffGroups.has(request.dropoff)) {
        dropoffGroups.set(request.dropoff, []);
      }

      dropoffGroups.get(request.dropoff).push(request);
    });

    this.requestGroups.set('dropoff', []);
    dropoffGroups.forEach((requests, dropoff) => {
      dropoff = dropoff || 'Unknown dropoff location';
      this.requestGroups.get('dropoff').push({
        id: dropoff,
        title: dropoff,
        requests: requests
      })
    });
  }

  updateGroupDateNeeded() {
    const dateNeededGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by date
    this.requests.forEach(request => {
      if (!dateNeededGroups.has(request.date)) {
        dateNeededGroups.set(request.date, []);
      }

      dateNeededGroups.get(request.date).push(request);
    });

    this.requestGroups.set('date', []);
    dateNeededGroups.forEach((requests, date) => {
      const title = date ? this.getDateString(new Date(date)) : 'Unknown dropoff date';
      this.requestGroups.get('date').push({id: date, title, requests});
    });
  }

  updateGroupCategory() {
    // Cannot build out this group if items is not populated yet
    if (!this.items) { return; }

    const itemMap: Map<string, Item> = new Map();
    this.items.forEach(item => itemMap.set(item.$key, item));

    const categoryGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by item
    this.requests.forEach(request => {
      const category = itemMap.get(request.item).categories.split(',')[0].trim();
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }

      categoryGroups.get(category).push(request);
    });

    this.requestGroups.set('category', []);
    categoryGroups.forEach((requests, categoryKey) => {
      this.requestGroups.get('category').push({
        id: categoryKey,
        title: categoryKey,
        requests: requests
      });
    });
  }

  updateGroupTags() {
    const tagMap: Map<string, Request[]> = new Map();
    this.requests.forEach(request => {
      const tags = request.tags ? request.tags.split(',') : ['No Tag Set'];
      tags.forEach(tag => {
        if (!tagMap.get(tag)) { tagMap.set(tag, []); }
        tagMap.get(tag).push(request);
      });
    });

    this.requestGroups.set('tags', []);
    tagMap.forEach((requests, tag) => {
      this.requestGroups.get('tags').push({
        id: tag,
        title: tag,
        requests: requests
      });
    });
  }

  getDateString(d: Date): string {
    const dayNames = [
      'Sunday', 'Monday', 'Tuesday',
      'Wednesday', 'Thursday',
      'Friday', 'Saturday'
    ];
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const readableDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    return readableDate + ` (${dayNames[d.getDay()]})`;

  }
}
