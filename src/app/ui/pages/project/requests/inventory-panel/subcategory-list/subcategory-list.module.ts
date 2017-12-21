import {NgModule} from '@angular/core';
import {SubcategoryListComponent} from './subcategory-list.component';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {
  InventoryPanelItemModule
} from '../inventory-panel-item/inventory-panel-item.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    InventoryPanelItemModule,
  ],
  declarations: [SubcategoryListComponent],
  exports: [SubcategoryListComponent],
})
export class SubcategoryListModule { }
