import {NgModule} from '@angular/core';
import {ProjectRequestsComponent} from './project-requests.component';
import {RemainingBudgetModule} from './remaining-budget/remaining-budget.module';
import {RequestsListModule} from 'app/ui/pages/shared/requests-list/requests-list.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {InventoryPanelModule} from './inventory-panel/inventory-panel.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RemainingBudgetModule,
    InventoryPanelModule,
    RequestsListModule,
  ],
  declarations: [ProjectRequestsComponent],
  exports: [ProjectRequestsComponent],
})
export class ProjectRequestsModule { }