import {NgModule} from '@angular/core';
import {InventoryPage} from './inventory-page';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from 'app/material.module';
import {CommonModule} from '@angular/common';
import {EditableItemPropertyModule} from './editable-item-property/editable-item-property.module';
import {AdvancedSearchModule} from 'app/season/shared/advanced-search/advanced-search.module';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ItemDialogModule} from 'app/season/shared/dialog/item/item-dialog.module';
import {LoadingModule} from 'app/season/shared/loading/loading.module';

const routes: Routes = [{path: '', component: InventoryPage}];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class InventoryPageRoutingModule {}

@NgModule({
  imports: [
    AdvancedSearchModule,
    InventoryPageRoutingModule,
    EditableItemPropertyModule,
    MaterialModule,
    ItemDialogModule,
    ScrollingModule,
    CommonModule,
    LoadingModule,
  ],
  declarations: [InventoryPage],
  exports: [InventoryPage],
})
export class InventoryPageModule { }
