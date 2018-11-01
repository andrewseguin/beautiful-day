import {NgModule} from '@angular/core';
import {RemainingBudget} from './remaining-budget';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [RemainingBudget],
  exports: [RemainingBudget],
})
export class RemainingBudgetModule { }
