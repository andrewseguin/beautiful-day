import {Injectable, OnDestroy} from '@angular/core';
import {RequestsService} from './requests.service';
import {ItemsService} from './items.service';
import {Observable} from 'rxjs/Observable';
import {ProjectsService} from './projects.service';
import {Request} from '../model/request';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map, takeUntil} from 'rxjs/operators';
import {Item} from 'app/model/item';
import {Subject} from 'rxjs';

export interface BudgetResponse {
  budget: number;
  cost: number;
  remaining: number;
}

@Injectable()
export class AccountingService {
  constructor(private projectsService: ProjectsService,
              private requestsService: RequestsService,
              private itemsService: ItemsService) { }

  /** Returns a stream of a project's budget and costs. */
  getBudgetStream(projectId: string): Observable<BudgetResponse> {
    const changes = [
      this.projectsService.get(projectId).pipe(map(project => project.budget)),
      this.requestsService.getProjectRequests(projectId),
      this.itemsService.items,
    ];

    return combineLatest(changes).pipe(
      map((result: any[]) => {
        const budget: number = result[0];
        const requests: Request[] = result[1];
        const items: Item[] = result[2];

        const itemCosts = new Map<string, number>();
        items.forEach(item => itemCosts.set(item.$key, item.cost));

        const cost = this.getAllRequestsCost(requests, itemCosts);
        return this._constructBudgetResponse(budget, cost);
      }));
  }

  /** Returns the cost of all requests. */
  getAllRequestsCost(requests: Request[], itemCosts: Map<string, number>): number {
    // No request cost if there is no inventory items or requests.
    if (!itemCosts.size || !requests.length) {
      return 0;
    }

    return requests
      // Convert all requests to their cost
      .map(request => this.getRequestCost(itemCosts.get(request.item), request))
      // Add all costs
      .reduce((totalCost, requestCost) => totalCost + requestCost);
  }

  /** Returns the cost of a request (quantity * item cost). */
  getRequestCost(itemCost: number, request: Request) {
    let quantityToPurchase = request.quantity;

    if (request.allocation) {
      quantityToPurchase -= request.allocation;
      quantityToPurchase = Math.max(quantityToPurchase, 0);
    }

    return itemCost ? quantityToPurchase * itemCost : 0;
  }

  /** Constructs a budget response with the budget, cost, and remaining balance. */
  _constructBudgetResponse(budget: number, cost: number) {
    return {budget, cost, remaining: budget - cost};
  }
}
