import {Injectable} from "@angular/core";
import {RequestsService} from "./requests.service";
import {ItemsService} from "./items.service";
import {Observable} from "rxjs";
import {Item} from "../model/item";
import {ProjectsService} from "./projects.service";

export interface BudgetResponse {
  budget: number;
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
    let projectBudget = 0;
    return this.itemsService.getItems()
      .debounceTime(100).flatMap(items => {
        if (!this.items.size) { this.saveItems(items) }
        return this.projectsService.getBudget(projectId)
      })
      .debounceTime(100).flatMap(budget => {
        projectBudget = budget || 0;
        return this.requestsService.getProjectRequests(projectId);
      })
      .debounceTime(100).map(requests => {
        if (!this.items.size || !requests.length) return 0;

        const requestsCost = requests
        // Convert all requests to their cost
          .map(request => {
            const item = this.items.get(request.item);
            if (!item.cost) {
              console.log(`Missing cost for ${item.name}`);
              return 0;
            }
            return request.quantity * item.cost;
          })
          // Add all costs
          .reduce((totalCost, requestCost) => totalCost + requestCost);

        return {
          budget: projectBudget,
          remaining: projectBudget - requestsCost
        };
      });

    /* Would rather do a fork join but couldnt make it trigger
    Observable.forkJoin(
      this.projectsService.getBudget(projectId),
      this.requestsService.getProjectRequests(projectId))
      .subscribe(console.log);
       */
  }
}
