import { Injectable } from '@angular/core';
import {RequestsService} from "./requests.service";
import {Request} from "../model/request";
import {ItemsService} from "./items.service";
import {Item} from "../model/item";
import {CategoriesService} from "./categories.service";
import {Category} from "../model/category";

export type Group = 'all' | 'category' | 'project' | 'date' | 'dropoff';

export class RequestGroup {
  id: string;
  title: string;
  requests: Request[]
}

@Injectable()
export class RequestGroupingService {
  items: Item[];
  categories: Category[];

  constructor(private requestsService: RequestsService,
              private categoriesService: CategoriesService,
              private itemsService: ItemsService) {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.itemsService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  getGroupNames(): string[] {
    return ['all', 'category', 'date', 'dropoff'];
  }

  getRequestGroups(projectId: string): Map<Group, RequestGroup[]> {
    const requestGroups: Map<Group, RequestGroup[]> = new Map();
    requestGroups.set('all', []);
    requestGroups.set('category', []);
    requestGroups.set('date', []);
    requestGroups.set('dropoff', []);

    // Update groups when items, categories, or requests change
    this.requestsService.getProjectRequests(projectId).subscribe(requests => {
      this.updateGroupAll(requestGroups, requests);
      this.updateGroupDropoffLocation(requestGroups, requests);
      this.updateGroupDateNeeded(requestGroups, requests);
      this.updateGroupCategory(requestGroups, requests);
    });

    return requestGroups;
  }

  updateGroupAll(requestGroups: Map<Group, RequestGroup[]>, requests: Request[]) {
    const allRequestGroups = requestGroups.get('all');
    const allRequestGroup = allRequestGroups
      .find(requestGroup => requestGroup.id === 'all');

    if (!allRequestGroup) {
      allRequestGroups.push({
        id: 'all',
        title: 'All',
        requests: requests
      });
    } else {
      allRequestGroup.requests = requests;
    }
  }

  updateGroupDropoffLocation(requestGroups: Map<Group, RequestGroup[]>, requests: Request[]) {
    const dropoffGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by dropoff
    requests.forEach(request => {
      if (!dropoffGroups.has(request.dropoff)) {
        dropoffGroups.set(request.dropoff, []);
      }

      dropoffGroups.get(request.dropoff).push(request);
    });

    requestGroups.set('dropoff', []);
    dropoffGroups.forEach((requests, dropoff) => {
      requestGroups.get('dropoff').push({
        id: dropoff,
        title: dropoff,
        requests: requests
      })
    });
  }

  updateGroupDateNeeded(requestGroups: Map<Group, RequestGroup[]>, requests: Request[]) {
    const dateNeededGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by date
    requests.forEach(request => {
      if (!dateNeededGroups.has(request.date)) {
        dateNeededGroups.set(request.date, []);
      }

      dateNeededGroups.get(request.date).push(request);
    });

    requestGroups.set('date', []);
    dateNeededGroups.forEach((requests, date) => {
      requestGroups.get('date').push({
        id: date,
        title: this.getDateString(new Date(date)) ,
        requests: requests
      })
    });
  }

  updateGroupCategory(requestGroups: Map<Group, RequestGroup[]>, requests: Request[]) {
    const itemMap: Map<string, Item> = new Map();
    this.items.forEach(item => itemMap.set(item.$key, item));

    let categoryMap: Map<string, Category> = new Map();
    this.categories.forEach(category => categoryMap.set(category.$key, category));

    const categoryGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by item
    requests.forEach(request => {
      const category = itemMap.get(request.item).category;
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }

      categoryGroups.get(category).push(request);
    });

    requestGroups.set('category', []);
    categoryGroups.forEach((requests, categoryKey) => {
      requestGroups.get('category').push({
        id: categoryKey,
        title: categoryMap.get(categoryKey).name,
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
