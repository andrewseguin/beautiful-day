import {Component, OnInit, Input} from '@angular/core';
import {AccountingService} from "../../../../../service/accounting.service";
import * as CountUp from 'countup.js';
import {Subscription} from "rxjs";

@Component({
  selector: 'remaining-budget',
  templateUrl: './remaining-budget.component.html',
  styleUrls: ['./remaining-budget.component.scss'],
  host: {
    '[class.md-elevation-z10]': 'true',
    '[class.negative]': 'currentRemainingBudget < 0',
    '[style.display]': "currentRemainingBudget == undefined ? 'none' : ''"
  }
})
export class RemainingBudgetComponent implements OnInit {
  budgetStream: Subscription;
  projectBudget: number;
  previousRemainingBudget: number = 0;
  currentRemainingBudget: number;

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
          this.projectBudget = budgetResponse.budget;
          this.previousRemainingBudget = this.currentRemainingBudget || budgetResponse.remaining;
          this.currentRemainingBudget = budgetResponse.remaining;
          this.updateBudgetValue();
        });
  }

  ngOnDestroy() {
    this.budgetStream.unsubscribe();
  }

  updateBudgetValue() {
    console.log('update budget value')
    new CountUp('budget-remaining',
        this.previousRemainingBudget,
        this.currentRemainingBudget,
        this.decimals,
        this.duration,
        this.countUpOptions)
        .start()
  }

}
