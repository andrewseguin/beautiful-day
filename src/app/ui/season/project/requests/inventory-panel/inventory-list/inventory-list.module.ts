import {NgModule} from '@angular/core';
import {InventoryListComponent} from './inventory-list.component';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {SubcategoryListModule} from '../subcategory-list/subcategory-list.module';
import {InventoryPanelItemModule} from '../inventory-panel-item/inventory-panel-item.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SubcategoryListModule,
    InventoryPanelItemModule,
  ],
  declarations: [InventoryListComponent],
  exports: [InventoryListComponent],
})
export class InventoryListModule { }
