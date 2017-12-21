import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {InventoryPanelComponent} from './inventory-panel.component';
import {MaterialModule} from 'app/material.module';
import {InventorySearchModule} from './inventory-search/inventory-search.module';
import {SubcategoryListModule} from './subcategory-list/subcategory-list.module';
import {InventoryListModule} from './inventory-list/inventory-list.module';
import {SlidingPanelModule} from './sliding-panel/sliding-panel.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InventorySearchModule,
    InventoryListModule,
    SubcategoryListModule,
    SlidingPanelModule,
  ],
  declarations: [InventoryPanelComponent],
  exports: [InventoryPanelComponent],
})
export class InventoryPanelModule { }
