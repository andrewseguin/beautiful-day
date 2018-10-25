import {Request} from 'app/model/request';
import {Item} from 'app/model/item';
import {Group} from 'app/ui/season/shared/requests-list/render/request-renderer-options';

export class RequestGroup {
  id: string;
  title: string;
  requests: Request[];
}

export class RequestGrouping {
  constructor(private items: Item[], private requests: Request[]) { }

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
      case 'item':
        return this.getGroupItem();
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
      const dateStr = request.date.toString();
      if (!dateNeededGroups.has(dateStr)) {
        dateNeededGroups.set(dateStr, []);
      }

      dateNeededGroups.get(dateStr).push(request);
    });

    const requestGroups = [];
    dateNeededGroups.forEach((requests, date) => {
      const title = date ? this.getDateString(new Date(Number(date))) : 'Unknown dropoff date';
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
      const category = itemMap.get(request.item).categories.split(',')[0].trim();
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
      const tags = request.tags ? request.tags.split(',') : ['No Tag Set'];
      tags.forEach(tag => {
        if (!tagMap.get(tag)) { tagMap.set(tag, []); }
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
    if (!this.items) { return; }

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
      let title = `${item.name}`;

      requestGroups.push({id: itemKey, title, requests});
    });

    return requestGroups;
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

    const readableDate = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    return readableDate + ` (${dayNames[d.getDay()]})`;

  }
}
