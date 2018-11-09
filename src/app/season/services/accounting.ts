import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map} from 'rxjs/operators';
import {Item, ItemsDao, ProjectsDao, Request, RequestsDao} from 'app/season/dao';
import {getRequestCost} from 'app/season/utility/request-cost';

export interface BudgetResponse {
  budget: number;
  cost: number;
  remaining: number;
}

@Injectable()
export class Accounting {
  constructor(private projectsDao: ProjectsDao,
              private requestsDao: RequestsDao,
              private itemsDao: ItemsDao) { }

  /** Returns a stream of a project's budget and costs. */
  getBudgetStream(projectId: string): Observable<BudgetResponse | null> {
    const changes = [
      this.projectsDao.get(projectId).pipe(map(project => project.budget)),
      this.requestsDao.getByProject(projectId),
      this.itemsDao.list,
    ];

    return combineLatest(changes).pipe(
      map((result: any[]) => {
        const budget: number = result[0];
        const requests: Request[] = result[1];
        const items: Item[] = result[2];

        if (!items) {
          return null;
        }

        const itemCosts = new Map<string, number>();
        items.forEach(item => itemCosts.set(item.id, item.cost));

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
      .map(request => getRequestCost(itemCosts.get(request.item), request))
      // Add all costs
      .reduce((totalCost, requestCost) => totalCost + requestCost);
  }

  /** Constructs a budget response with the budget, cost, and remaining balance. */
  _constructBudgetResponse(budget: number, cost: number) {
    return {budget, cost, remaining: budget - cost};
  }
}
