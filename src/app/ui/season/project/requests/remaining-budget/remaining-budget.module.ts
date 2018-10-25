import {NgModule} from '@angular/core';
import {RemainingBudgetComponent} from './remaining-budget.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [RemainingBudgetComponent],
  exports: [RemainingBudgetComponent],
})
export class RemainingBudgetModule { }
