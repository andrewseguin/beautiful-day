import { Injectable } from '@angular/core';
import {RequestsService} from "./requests.service";
import {Request} from "../model/request";

export type Group = 'all' | 'category' | 'project' | 'date needed' | 'dropoff location';

export class RequestGroup {
  title: string;
  requests: Request[]
}

@Injectable()
export class RequestGroupingService {
  requestGroups: Map<Group, Map<string, Request[]>> = new Map;

  constructor(private requestsService: RequestsService) {
  }

  getGroupNames(): string[] {
    return ['all', 'category', 'project', 'date needed', 'dropoff location'];
  }

  getRequestGroups(projectId: string): Map<Group, Map<string, Request[]>> {
    const requestGroups: Map<Group, Map<string, Request[]>> = new Map;
    requestGroups.set('all', new Map());
    requestGroups.set('category', new Map());
    requestGroups.set('project', new Map());
    requestGroups.set('date needed', new Map());
    requestGroups.set('dropoff location', new Map());

    this.requestsService.getProjectRequests(projectId).subscribe(requests => {
      this.requestGroups.get('all').set('all', requests);
    });

    return requestGroups;
  }
}
