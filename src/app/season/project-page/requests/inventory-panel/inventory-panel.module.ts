import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {InventoryPanel} from './inventory-panel';
import {MaterialModule} from 'app/material.module';
import {SlidingPanelModule} from './sliding-panel/sliding-panel.module';
import {CategoryListModule} from './category-list/category-list.module';
import {InventorySearchModule} from './inventory-search/inventory-search.module';
import {SearchResultsModule} from './search-results/search-results.module';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InventorySearchModule,
    CategoryListModule,
    SlidingPanelModule,
    SearchResultsModule,
    ScrollingModule,
  ],
  declarations: [InventoryPanel],
  exports: [InventoryPanel],
})
export class InventoryPanelModule { }
