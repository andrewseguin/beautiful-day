import {Component, OnInit, Input} from '@angular/core';
import {AccountingService} from 'app/service/accounting.service';
import * as CountUp from 'countup.js';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'remaining-budget',
  templateUrl: './remaining-budget.component.html',
  styleUrls: ['./remaining-budget.component.scss'],
  host: {
    '[class.mat-elevation-z10]': 'true',
    '[class.negative]': 'currentRemainingBudget < 0',
    '[class.positive]': 'currentRemainingBudget > 0',
    '[class.loaded]': 'budgetLoaded'
  }
})
export class RemainingBudgetComponent implements OnInit {
  budgetStream: Subscription;
  budgetLoaded: boolean;
  projectBudget: number;
  previousRemainingBudget = 0;
  currentRemainingBudget: number;

  // Countup.js settings
  decimals = 2;
  duration = .75;
  countUpOptions = {
    useEasing : true,
    useGrouping : true,
    separator : ',',
    decimal : '.',
    prefix : '$ ',
    suffix : ''
  };

  @Input() projectId: string;

  constructor(private accountingService: AccountingService) { }

  ngOnInit() {
    this.budgetStream = this.accountingService.getBudgetStream(this.projectId)
        .subscribe(budgetResponse => {
          this.budgetLoaded = true;
          this.projectBudget = budgetResponse.budget;

          this.previousRemainingBudget =
              this.currentRemainingBudget !== undefined ?
                this.currentRemainingBudget : budgetResponse.remaining;
          this.currentRemainingBudget = budgetResponse.remaining;

          if (budgetResponse.budget !== undefined) {
            this.updateBudgetValue();
          }
        });
  }

  ngOnDestroy() {
    this.budgetStream.unsubscribe();
  }

  updateBudgetValue() {
    new CountUp('budget-remaining',
        this.previousRemainingBudget,
        this.currentRemainingBudget,
        this.decimals,
        this.duration,
        this.countUpOptions)
        .start();
  }

}
