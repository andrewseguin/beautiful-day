import { Injectable } from '@angular/core';
import {RequestsService} from "./requests.service";
import {Request} from "../model/request";

export type Group = 'all' | 'category' | 'project' | 'date needed' | 'dropoff location';

export class RequestGroup {
  id: string;
  title: string;
  requests: Request[]
}

@Injectable()
export class RequestGroupingService {
  constructor(private requestsService: RequestsService) { }

  getGroupNames(): string[] {
    return ['all', 'category', 'project', 'date needed', 'dropoff location'];
  }

  getRequestGroups(projectId: string): Map<Group, RequestGroup[]> {
    const requestGroups: Map<Group, RequestGroup[]> = new Map();
    requestGroups.set('all', []);
    requestGroups.set('category', []);
    requestGroups.set('project', []);
    requestGroups.set('date needed', []);
    requestGroups.set('dropoff location', []);

    this.requestsService.getProjectRequests(projectId).subscribe(requests => {
      this.updateGroupAll(requestGroups, requests);
      this.updateGroupDropoffLocation(requestGroups, requests);
      this.updateGroupDateNeeded(requestGroups, requests);
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

    requestGroups.set('dropoff location', []);
    dropoffGroups.forEach((requests, dropoff) => {
      requestGroups.get('dropoff location').push({
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

    requestGroups.set('date needed', []);
    dateNeededGroups.forEach((requests, date) => {
      requestGroups.get('date needed').push({
        id: date,
        title: this.getDateString(new Date(date)) ,
        requests: requests
      })
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
