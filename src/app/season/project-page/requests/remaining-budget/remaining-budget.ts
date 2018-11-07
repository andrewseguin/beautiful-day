import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Accounting} from 'app/season/services/accounting';
import * as CountUp from 'countup.js';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'remaining-budget',
  templateUrl: 'remaining-budget.html',
  styleUrls: ['remaining-budget.scss'],
  host: {
    '[class.negative]': 'currentRemainingBudget < 0',
    '[class.positive]': 'currentRemainingBudget > 0',
    '[class.loaded]': 'budgetLoaded'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemainingBudget implements OnInit {
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

  private destroyed = new Subject();

  constructor(private accounting: Accounting) { }

  ngOnInit() {
    this.accounting.getBudgetStream(this.projectId)
        .pipe(takeUntil(this.destroyed))
        .subscribe(budgetResponse => {
          if (!budgetResponse) {
            return;
          }

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
    this.destroyed.next();
    this.destroyed.complete();
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
