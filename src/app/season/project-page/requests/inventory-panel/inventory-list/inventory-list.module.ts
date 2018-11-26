import {NgModule} from '@angular/core';
import {InventoryList} from './inventory-list';
import {CommonModule} from '@angular/common';
import {MaterialModule} from 'app/material.module';
import {SubcategoryListModule} from '../subcategory-list/subcategory-list.module';
import {InventoryPanelItemModule} from '../inventory-panel-item/inventory-panel-item.module';
import {ItemDialogModule} from 'app/season/shared/dialog/item/item-dialog.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SubcategoryListModule,
    InventoryPanelItemModule,
    ItemDialogModule,
    LoadingModule,
  ],
  declarations: [InventoryList],
  exports: [InventoryList],
})
export class InventoryListModule { }
