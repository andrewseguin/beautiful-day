import {Injectable} from '@angular/core';
import {RequestsService} from './requests.service';
import {ItemsService} from './items.service';
import {Observable} from 'rxjs';
import {Item} from '../model/item';
import {ProjectsService} from './projects.service';
import {Request} from '../model/request';
import 'rxjs/add/operator/debounceTime';

export interface BudgetResponse {
  budget: number;
  cost: number;
  remaining: number;
}

@Injectable()
export class AccountingService {
  items = new Map<string, Item>();

  constructor(private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) {
    this.itemsService.getItems().subscribe(items => this.saveItems(items));
  }

  saveItems(items: Item[]) {
    items.forEach(item => this.items.set(item.$key, item));
  }

  getBudgetStream(projectId: string): Observable<BudgetResponse> {
    let projectBudget;
    return this.itemsService.getItems()
      .debounceTime(100).flatMap(items => {
        if (!this.items.size) { this.saveItems(items) }
        return this.projectsService.getBudget(projectId)
      })
      .debounceTime(100).flatMap(budget => {
        projectBudget = budget;

        if (budget == null) { return Observable.from([null]) }
        return this.requestsService.getProjectRequests(projectId);
      })
      .debounceTime(100).map(requests => {
        if (!this.items.size || !requests || !requests.length) {
          return {
            budget: projectBudget,
            cost: 0,
            remaining: projectBudget,
          };
        }

        const requestsCost = requests
          // Convert all requests to their cost
          .map(request => this.getRequestCost(this.items.get(request.item), request))
          // Add all costs
          .reduce((totalCost, requestCost) => totalCost + requestCost);

        return {
          budget: projectBudget,
          cost: requestsCost,
          remaining: projectBudget - requestsCost
        };
      });
  }

  getRequestCost(item: Item, request: Request) {
    let quantityToPurchase = request.quantity;

    if (request.allocation) {
      quantityToPurchase -= request.allocation;
      quantityToPurchase = Math.max(quantityToPurchase, 0);
    }

    return item.cost ? quantityToPurchase * item.cost : 0;
  }
}
