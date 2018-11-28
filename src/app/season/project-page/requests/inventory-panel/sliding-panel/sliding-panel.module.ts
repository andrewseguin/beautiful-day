import {NgModule} from '@angular/core';
import {SlidingPanel} from './sliding-panel';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {AddNewItemModule} from '../add-new-item/add-new-item.module';
import {CategoryListModule} from '../category-list/category-list.module';
import {InventoryPanelItemModule} from '../inventory-panel-item/inventory-panel-item.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AddNewItemModule,
    CategoryListModule,
    InventoryPanelItemModule,
  ],
  declarations: [SlidingPanel],
  exports: [SlidingPanel],
})
export class SlidingPanelModule { }
