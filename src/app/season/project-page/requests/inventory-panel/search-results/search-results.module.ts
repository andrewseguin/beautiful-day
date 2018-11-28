import {NgModule} from '@angular/core';
import {SearchResults} from './search-results';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {InventoryPanelItemModule} from '../inventory-panel-item/inventory-panel-item.module';
import {AddNewItemModule} from '../add-new-item/add-new-item.module';

@NgModule({
  imports: [
    CommonModule,
    InventoryPanelItemModule,
    MaterialModule,
    AddNewItemModule,
  ],
  declarations: [SearchResults],
  exports: [SearchResults],
})
export class SearchResultsModule { }
