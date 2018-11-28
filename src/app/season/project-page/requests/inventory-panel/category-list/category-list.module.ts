import {NgModule} from '@angular/core';
import {CategoryList} from './category-list';
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
  declarations: [CategoryList],
  exports: [CategoryList],
})
export class CategoryListModule { }
