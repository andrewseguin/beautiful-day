import {NgModule} from '@angular/core';
import {SubcategoryList} from './subcategory-list';
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
  declarations: [SubcategoryList],
  exports: [SubcategoryList],
})
export class SubcategoryListModule { }
