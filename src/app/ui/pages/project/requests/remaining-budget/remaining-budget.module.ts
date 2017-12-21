import {NgModule} from '@angular/core';
import {RemainingBudgetComponent} from './remaining-budget.component';
import {MaterialModule} from 'app/material.module';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [RemainingBudgetComponent],
  exports: [RemainingBudgetComponent],
})
export class RemainingBudgetModule { }
