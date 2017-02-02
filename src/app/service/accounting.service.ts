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
            remaining: projectBudget,
          };
        }

        const requestsCost = requests
        // Convert all requests to their cost
          .map(request => {
            const item = this.items.get(request.item);
            return item.cost ? request.quantity * item.cost : 0;
          })
          // Add all costs
          .reduce((totalCost, requestCost) => totalCost + requestCost);

        return {
          budget: projectBudget,
          remaining: projectBudget - requestsCost
        };
      });
  }
}
