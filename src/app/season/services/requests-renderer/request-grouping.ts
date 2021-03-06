import {Item, Request, Project} from 'app/season/dao/index';
import {Group} from 'app/season/services/requests-renderer/request-renderer-options';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {getItemName} from 'app/season/utility/item-name';

export class RequestGroup {
  id: string;
  title: string;
  requests: Request[];
}

export class RequestGrouping {
  constructor(private items: Item[], private requests: Request[], private projects: Project[]) {}

  getGroup(group: Group) {
    switch (group) {
      case 'all':
        return this.getGroupAll();
      case 'category':
        return this.getGroupCategory();
      case 'date':
        return this.getGroupDateNeeded();
      case 'dropoff':
        return this.getGroupDropoffLocation();
      case 'tags':
        return this.getGroupTags();
      case 'project':
        return this.getGroupProject();
      case 'purchaser':
        return this.getGroupPurchaser();
    }
  }

  getGroupAll(): RequestGroup[] {
    return [{
      id: 'all',
      title: `${this.requests.length} requests`,
      requests: this.requests
    }];
  }

  getGroupDropoffLocation(): RequestGroup[] {
    const dropoffGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by dropoff
    this.requests.forEach(request => {
      if (!dropoffGroups.has(request.dropoff)) {
        dropoffGroups.set(request.dropoff, []);
      }

      dropoffGroups.get(request.dropoff).push(request);
    });

    const requestGroups = [];
    dropoffGroups.forEach((requests, dropoff) => {
      dropoff = dropoff || 'Unknown dropoff location';
      requestGroups.push({
        id: dropoff,
        title: dropoff,
        requests: requests
      });
    });

    return requestGroups;
  }

  getGroupDateNeeded(): RequestGroup[] {
    const dateNeededGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by date
    this.requests.forEach(request => {
      const dateStr = request.date;
      if (!dateNeededGroups.has(dateStr)) {
        dateNeededGroups.set(dateStr, []);
      }

      dateNeededGroups.get(dateStr).push(request);
    });

    const requestGroups = [];
    dateNeededGroups.forEach((requests, date) => {
      const title = new DatePipe('en-US').transform(new Date(date), 'MMMM d (EEEE)');
      requestGroups.push({id: date, title, requests});
    });

    return requestGroups;
  }

  getGroupCategory(): RequestGroup[] {
    const itemMap: Map<string, Item> = new Map();
    this.items.forEach(item => itemMap.set(item.id, item));

    const categoryGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by item
    this.requests.forEach(request => {
      const item = itemMap.get(request.item) || {categories: ['Missing item']};
      const category = item.categories[0].split('>')[0].trim();
      if (!categoryGroups.has(category)) {
        categoryGroups.set(category, []);
      }

      categoryGroups.get(category).push(request);
    });

    const requestGroups = [];
    categoryGroups.forEach((requests, categoryKey) => {
      requestGroups.push({
        id: categoryKey,
        title: categoryKey,
        requests: requests
      });
    });

    return requestGroups;
  }

  getGroupTags(): RequestGroup[] {
    const tagMap: Map<string, Request[]> = new Map();
    this.requests.forEach(request => {
      const tags = request.tags ? request.tags : ['No Tag Set'];
      tags.forEach(tag => {
        if (!tagMap.get(tag)) {tagMap.set(tag, []);}
        tagMap.get(tag).push(request);
      });
    });

    const requestGroups = [];
    tagMap.forEach((requests, tag) => {
      requestGroups.push({
        id: tag,
        title: tag,
        requests: requests
      });
    });

    return requestGroups;
  }

  getGroupItem(): RequestGroup[] {
    // Cannot build out this group if items is not populated yet
    if (!this.items) {return;}

    const itemMap: Map<string, Item> = new Map();
    this.items.forEach(item => itemMap.set(item.id, item));

    const itemGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by item
    this.requests.forEach(request => {
      if (!itemGroups.has(request.item)) {
        itemGroups.set(request.item, []);
      }

      itemGroups.get(request.item).push(request);
    });

    const requestGroups = [];
    itemGroups.forEach((requests, itemKey) => {
      const item = itemMap.get(itemKey);
      requestGroups.push({id: itemKey, title: getItemName(item), requests});
    });

    return requestGroups;
  }

  getGroupProject(): RequestGroup[] {
    const projectGroups: Map<string, Request[]> = new Map();
    const projectMap: Map<string, Item> = new Map();
    this.projects.forEach(project => projectMap.set(project.id, project));

    // Create map of all requests keyed by project
    this.requests.forEach(request => {
      if (!projectGroups.has(request.project)) {
        projectGroups.set(request.project, []);
      }

      projectGroups.get(request.project).push(request);
    });

    const requestGroups = [];
    projectGroups.forEach((requests, project) => {
      requestGroups.push({
        id: project,
        title: projectMap.get(project).name,
        requests: requests
      });
    });

    return requestGroups;
  }

  getGroupPurchaser(): RequestGroup[] {
    const purchaserGroups: Map<string, Request[]> = new Map();

    // Create map of all requests keyed by purchaser
    this.requests.forEach(request => {
      if (!purchaserGroups.has(request.purchaser)) {
        purchaserGroups.set(request.purchaser, []);
      }

      purchaserGroups.get(request.purchaser).push(request);
    });

    const requestGroups = [];
    purchaserGroups.forEach((requests, purchaser) => {
      purchaser = purchaser || 'No purchaser assigned';
      requestGroups.push({
        id: purchaser,
        title: purchaser,
        requests: requests
      });
    });

    return requestGroups;
  }
}
