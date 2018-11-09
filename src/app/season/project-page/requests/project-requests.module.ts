import {NgModule} from '@angular/core';
import {ProjectRequests} from './project-requests';
import {RemainingBudgetModule} from './remaining-budget/remaining-budget.module';
import {RequestsListModule} from 'app/season/shared/requests-list/requests-list.module';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {InventoryPanelModule} from './inventory-panel/inventory-panel.module';
import {LoadingModule} from '../../shared/loading/loading.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RemainingBudgetModule,
    InventoryPanelModule,
    RequestsListModule,
    LoadingModule,
    RouterModule,
  ],
  declarations: [ProjectRequests],
  exports: [ProjectRequests],
})
export class ProjectRequestsModule { }
